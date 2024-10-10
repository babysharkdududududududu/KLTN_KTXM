import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDormSubmissionDto } from './dto/create-dorm_submission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { DormSubmission, DormSubmissionStatus } from './entities/dorm_submission.entity';
import { Model } from 'mongoose';
import { SettingService } from '../setting/setting.service';
import { UsersService } from '../users/users.service';
import { ContractsService } from '../contracts/contracts.service';
import { Room } from '../rooms/entities/room.entity';

@Injectable()
export class DormSubmissionService {
  constructor(
    @InjectModel(DormSubmission.name)
    private dormSubmissionModel: Model<DormSubmission>,
    @InjectModel(Room.name)
    private roomModel: Model<Room>,
    private readonly settingService: SettingService,
    private readonly userService: UsersService,
    private readonly contractService: ContractsService,
  ) { }

  // kiểm tra không cho đăng ký 2 lần một kỳ
  async isSubmissionExists(userId: string, settingId: string): Promise<boolean> {
    const submission = await this.dormSubmissionModel.exists({ userId, settingId });
    return !!submission;
  }

  async create(createDormSubmissionDto: CreateDormSubmissionDto) {
    const { userId, settingId } = createDormSubmissionDto;

    // Kiểm tra xem userId có tồn tại không
    const userExists = await this.userService.isUserIdExist(userId);
    if (!userExists) {
      throw new Error(`User with ID ${userId} does not exist`);
    }

    // Kiểm tra xem đã có bản ghi nào tồn tại với cùng userId và semester không
    const submissionExists = await this.isSubmissionExists(userId, settingId);
    if (submissionExists) {
      throw new Error(`Submission already exists for user ID ${userId} with setting ID ${settingId}`);
    }
    // Lấy hợp đồng gần nhất của người dùng
    const latestContract = await this.contractService.getLatestRoomByUserId(userId);

    // Gán roomNumber là NaN nếu không tìm thấy hợp đồng
    const roomNumber = latestContract ? latestContract.roomNumber : NaN;

    // Tạo bản ghi dormSubmission
    const dormSubmission = new this.dormSubmissionModel({
      ...createDormSubmissionDto,
      roomNumber, // Thêm roomNumber vào create
      status: DormSubmissionStatus.PENDING,
    });

    try {
      await dormSubmission.save();
      await this.settingService.submissionCount(settingId);
      return dormSubmission;
    } catch (error) {
      console.error('Error creating dorm submission:', error);
      throw new Error(`Failed to create dorm submission: ${error.message}`);
    }
  }


  async findAll() {
    try {
      const dormSubmissions = await this.dormSubmissionModel.find().exec();
      return dormSubmissions;
    } catch (error) {
      console.error('Error fetching dorm submissions:', error);
      throw new Error('Failed to fetch dorm submissions');
    }
  }

  // find by settingId
  async findBySettingId(settingId: string) {
    try {
      const dormSubmissions = await this.dormSubmissionModel.find({ settingId }).exec();
      return dormSubmissions;
    } catch (error) {
      console.error('Error fetching dorm submissions:', error);
      throw new Error('Failed to fetch dorm submissions');
    }
  }

  async findOne(id: string) {
    try {
      const dormSubmission = await this.dormSubmissionModel.findById(id).exec();
      if (!dormSubmission) {
        throw new Error('Dorm submission not found');
      }
      return dormSubmission;
    } catch (error) {
      console.error('Error fetching dorm submission:', error);
      throw new Error(`Failed to fetch dorm submission: ${error.message}`);
    }
  }

  // chấp nhận đơn đăng ky
  async acceptSubmission(id: string): Promise<DormSubmission> {
    const submission = await this.dormSubmissionModel.findById(id);
    if (!submission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }

    submission.status = DormSubmissionStatus.ACCEPTED;
    return submission.save();
  }
  // Từ chối đơn đăng ký
  async rejectSubmission(id: string): Promise<DormSubmission> {
    const submission = await this.dormSubmissionModel.findById(id);
    if (!submission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }

    submission.status = DormSubmissionStatus.REJECTED;
    return submission.save();
  }

  // Đặt trạng thái đang chờ thanh toán
  async setAwaitingPayment(id: string): Promise<DormSubmission> {
    const submission = await this.dormSubmissionModel.findById(id);
    if (!submission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }

    submission.status = DormSubmissionStatus.AWAITING_PAYMENT;
    return submission.save();
  }

  // Đặt trạng thái đã thanh toán
  async setPaid(id: string): Promise<DormSubmission> {
    const submission = await this.dormSubmissionModel.findById(id);
    if (!submission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }

    submission.status = DormSubmissionStatus.PAID;
    return submission.save();
  }

  // render số hợp đồng gần
  async renderContractNumber(submission: DormSubmission): Promise<string> {
    const year = new Date().getFullYear(); // Lấy năm hiện tại
    const contractNumber = `${submission.roomNumber}-${submission.userId}-W${year}`;
    return contractNumber;
  }

  // Đã xếp phòng
  async setRoomAssigned(id: string, roomNumber: string): Promise<DormSubmission> {
    const submission = await this.dormSubmissionModel.findById(id);
    const userId = submission.userId;
    if (!submission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }
    //G2g201-20013581-2024930

    submission.status = DormSubmissionStatus.ASSIGNED; // Cập nhật trạng thái
    submission.roomNumber = roomNumber; // Cập nhật roomNumber

    const contractNumber = await this.renderContractNumber(submission); // Tạo số hợp đồng

        // Tạo hợp đồng
    const currentDate = new Date();
    const endDate = new Date(currentDate);
    endDate.setMonth(currentDate.getMonth() + 10);
    await this.contractService.create({userId, roomNumber, contractNumber, startDate: currentDate, endDate});

    return submission.save();
  }
  async autoAssignRooms(): Promise<void> {
    // Bước 1: Lấy danh sách các phòng có chỗ trống
    const availableRooms = await this.roomModel.find({ availableSpot: { $gt: 0 } });
    
    // Bước 2: Lấy danh sách các đơn đăng ký đang chờ
    const paidSubmissions = await this.dormSubmissionModel.find({ status: DormSubmissionStatus.PAID });

    // Bước 3: Xếp sinh viên vào phòng
    for (const submission of paidSubmissions) {
      const room = availableRooms.find(r => r.availableSpot > 0);
      if (!room) {
        console.log('Không còn phòng trống để xếp.');
        break; // Nếu không còn phòng trống, dừng lại
      }

      // Cập nhật trạng thái và số phòng cho đơn đăng ký
      submission.status = DormSubmissionStatus.ASSIGNED;
      submission.roomNumber = room.roomNumber;

      // Cập nhật số chỗ trống của phòng
      room.availableSpot -= 1;

      // Lưu đơn đăng ký và phòng
      await submission.save();
      await room.save();

      console.log(`Đã xếp sinh viên ${submission.userId} vào phòng ${room.roomNumber}`);
    }
  }
}
