import { SettingService } from './../setting/setting.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDormSubmissionDto } from './dto/create-dorm_submission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { DormSubmission, DormSubmissionStatus } from './entities/dorm_submission.entity';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { ContractsService } from '../contracts/contracts.service';
import { Room } from '../rooms/entities/room.entity';
import { User } from '../users/schemas/user.schema';
import { Contract } from '../contracts/entities/contract.entity';
import { log } from 'console';
import { DormPayment } from '../dorm_payment/entities/dorm_payment.entity';
import { DormPaymentService } from '../dorm_payment/dorm_payment.service';
import { Setting } from '../setting/entities/setting.entity';

@Injectable()
export class DormSubmissionService {
  constructor(
    @InjectModel(DormSubmission.name)
    private dormSubmissionModel: Model<DormSubmission>,
    @InjectModel(Room.name)
    private roomModel: Model<Room>,
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(Contract.name)
    private contractModel: Model<Contract>,
    @InjectModel(Setting.name) private settingModel: Model<Setting>,
    private readonly settingService: SettingService,
    private readonly userService: UsersService,
    private readonly contractService: ContractsService,
    private readonly dormPaymentService: DormPaymentService,
  ) { }

  // kiểm tra không cho đăng ký 2 lần một kỳ
  async isSubmissionExists(userId: string, settingId: string): Promise<boolean> {
    const submission = await this.dormSubmissionModel.exists({ userId, settingId });
    return !!submission;
  }
  // đơn đăng ký
  async create(createDormSubmissionDto: CreateDormSubmissionDto) {
    const { userId, settingId, email } = createDormSubmissionDto;
  
    // Kiểm tra xem userId có tồn tại không
    const userExists = await this.userService.isUserIdExist(userId);
    if (!userExists) {
      throw new Error(`User with ID ${userId} does not exist`);
    }
  
    // Nếu settingId không được cung cấp, tìm setting có registrationStatus là "open"
    let actualSettingId = settingId;
    if (!settingId) {
      const openSetting = await this.settingModel.findOne({ registrationStatus: 'open' });
      if (openSetting) {
        actualSettingId = openSetting._id.toString();
      } else {
        throw new Error('No open registration settings found');
      }
    }
  
    // Kiểm tra xem đã có bản ghi nào tồn tại với cùng userId và settingId không
    const submissionExists = await this.isSubmissionExists(userId, actualSettingId);
    if (submissionExists) {
      throw new Error(`Submission already exists for user ID ${userId} with setting ID ${actualSettingId}`);
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
      email,
      settingId: actualSettingId, // Gán settingId đã xác định
    });
  
    try {
      await this.settingService.updateSubmissionCount(userId);
      await this.settingService.submissionCount(actualSettingId);
      await dormSubmission.save();
      return dormSubmission;
    } catch (error) {
      console.error('Error creating dorm submission:', error);
      throw new Error(`Failed to create dorm submission: ${error.message}`);
    }
  }
  

  // get all submission with status
  async findAll() {
    try {
      const dormSubmissions = await this.dormSubmissionModel.find().exec();

      // Tính tổng số submission theo status
      const statusCount = dormSubmissions.reduce((acc, submission) => {
        const status = submission.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      // Tổng số submissions
      const totalByStatus = dormSubmissions.length;

      // Lấy tất cả settingId
      const settingIds = dormSubmissions.reduce((acc, submission) => {
        if (submission.settingId && !acc.includes(submission.settingId)) {
          acc.push(submission.settingId);
        }
        return acc;
      }, [] as string[]);

      // Lấy dữ liệu từ service setting
      const setting = await this.settingService.findAll();

      // Tạo một đối tượng nameSetting ánh xạ từ id -> name
      const nameSetting = setting.reduce((acc, item) => {
        acc[item._id.toString()] = item.name; // _id có thể là ObjectId, nên cần dùng toString()
        return acc;
      }, {} as Record<string, string>);

      return {
        statusCode: 200,
        message: '',
        data: dormSubmissions,
        totalByStatus: statusCount,
        total: totalByStatus,
        settingIds,
        nameSetting,  // Trả về đối tượng nameSetting với id -> name
      };
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

  async findOneWithUserId(userId: string) {
    try {
      const dormSubmission = await this.dormSubmissionModel.findOne({ userId: userId }).exec();
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
    const price = 560000;
    const numberOfMonths = 10;
    const amount = price * numberOfMonths;
    const userId = submission.userId;
    const email = submission.email;
    const paymentDate = new Date();
    const roomNumber = submission.roomNumber;
    if (!submission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }
    submission.statusHistory.push(submission.status);
    const dormPayment = this.dormPaymentService.create({
      userId,
      amount,
      paymentDate,
      roomNumber,
    });
    this.userService.sendMailApproveRoom(email);

    submission.status = DormSubmissionStatus.ACCEPTED;
    return submission.save();
  }
  // Từ chối đơn đăng ký
  async rejectSubmission(id: string): Promise<DormSubmission> {
    const submission = await this.dormSubmissionModel.findById(id);
    if (!submission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }
    submission.statusHistory.push(submission.status);
    this.userService.sendMailRejectRoom(submission.email);
    submission.status = DormSubmissionStatus.REJECTED;
    return submission.save();
  }

  // Đặt trạng thái đang chờ thanh toán
  async setAwaitingPayment(id: string): Promise<DormSubmission> {
    const submission = await this.dormSubmissionModel.findById(id);
    if (!submission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }
    submission.statusHistory.push(submission.status);
    submission.status = DormSubmissionStatus.AWAITING_PAYMENT;
    this.userService.sendMailAwaittingPayment(submission.email);
    return submission.save();
  }

  // Đặt trạng thái đã thanh toán
  async setPaid(id: string): Promise<DormSubmission> {
    const submission = await this.dormSubmissionModel.findById(id);
    if (!submission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }
    submission.statusHistory.push(submission.status);
    submission.status = DormSubmissionStatus.PAID;
    this.userService.sendMailPaymentSuccess(submission.email, submission.roomNumber);
    return submission.save();
  }

  // set tất cả trạng thái ACCEPTED thành AWAITING_PAYMENT
  // async setAwaitingPaymentAll(settingId: string): Promise<DormSubmission[]> {
  //   // Cập nhật trạng thái
  //   await this.dormSubmissionModel.updateMany(
  //     { status: DormSubmissionStatus.ACCEPTED, settingId: settingId },
  //     { status: DormSubmissionStatus.AWAITING_PAYMENT },
  //   ).exec();


  //   // Lấy lại các tài liệu đã cập nhật
  //   const submissions = await this.dormSubmissionModel.find(
  //     { status: DormSubmissionStatus.AWAITING_PAYMENT, settingId: settingId }
  //   ).exec();

  //   return submissions;
  // }
  async setAwaitingPaymentAll(settingId: string): Promise<DormSubmission[]> {
    try {
      // Cập nhật trạng thái
      await this.dormSubmissionModel.updateMany(
        { status: DormSubmissionStatus.ACCEPTED, settingId: settingId },
        { status: DormSubmissionStatus.AWAITING_PAYMENT },
      ).exec();
      // Lấy lại các tài liệu đã cập nhật
      const submissions = await this.dormSubmissionModel.find(
        { status: DormSubmissionStatus.AWAITING_PAYMENT, settingId: settingId }
      ).exec();
      // Gửi email cho từng sinh viên (sử dụng Promise.all để xử lý đồng thời)
      const emailPromises = submissions.map(async (submission) => {
        try {
          const user = await this.userModel.findOne({ userId: submission.userId });
          if (user) {
            await this.userService.sendMailAwaittingPayment(submission.email);
            console.log(`Sent email to user ${submission.userId}`);
          }
        } catch (error) {
          console.error(`Error sending email to user ${submission.userId}:`, error);
        }
      });
      // Đợi tất cả các Promise gửi email hoàn thành
      await Promise.all(emailPromises);
      return submissions;
    } catch (error) {
      console.error('Error updating dorm submissions or sending emails:', error);
      throw new Error('Failed to update dorm submissions and send emails');
    }
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
    submission.statusHistory.push(submission.status);
    console.log('submission.email:', submission.email);
    console.log('roomNumber:', roomNumber);
    this.userService.sendMailAssigned(submission.email, submission.roomNumber);
    submission.status = DormSubmissionStatus.ASSIGNED; // Cập nhật trạng thái
    submission.roomNumber = roomNumber; // Cập nhật roomNumber

    const contractNumber = await this.renderContractNumber(submission); // Tạo số hợp đồng

    // Tạo hợp đồng
    const currentDate = new Date();
    const endDate = new Date(currentDate);
    endDate.setMonth(currentDate.getMonth() + 10);
    await this.contractService.create({ userId, roomNumber, contractNumber, startDate: currentDate, endDate });

    return submission.save();
  }

  async autoAssignRooms(): Promise<void> {
    // Bước 1: Lấy danh sách các phòng có chỗ trống
    const availableRooms = await this.roomModel.find({ availableSpot: { $gt: 0 } });

    // Bước 2: Lấy danh sách các đơn đăng ký đã thanh toán
    const paidSubmissions = await this.dormSubmissionModel.find({ status: DormSubmissionStatus.PAID });

    // Bước 3: Xếp sinh viên vào phòng
    for (const submission of paidSubmissions) {
      // Lấy thông tin người dùng để kiểm tra giới tính
      const user = await this.userModel.findOne({ userId: submission.userId });
      if (!user) {
        console.log(`Không tìm thấy người dùng với userId: ${submission.userId}`);
        continue; // Bỏ qua nếu không tìm thấy người dùng
      }

      let room;

      // Xác định tòa nhà dựa trên giới tính
      const genderPrefix = user.gender === "1" ? "I" : "G"; // Nam là "I", Nữ là "G"

      // Kiểm tra xem có roomNumber hay không
      if (submission.roomNumber) {
        room = await this.roomModel.findOne({
          roomNumber: submission.roomNumber,
          availableSpot: { $gt: 0 },
        });
      }

      // Nếu không tìm thấy phòng cũ hoặc không còn chỗ trống, tìm phòng mới theo giới tính
      if (!room) {
        room = availableRooms.find(r => r.availableSpot > 0 && r.roomNumber.startsWith(genderPrefix));
      }

      // Nếu không còn phòng trống, dừng lại
      if (!room) {
        console.log('Không còn phòng trống để xếp.');
        break;
      }

      // Cập nhật trạng thái và số phòng cho đơn đăng ký
      submission.status = DormSubmissionStatus.ASSIGNED;
      submission.roomNumber = room.roomNumber;

      // Cập nhật số chỗ trống của phòng
      room.availableSpot -= 1;

      // Tạo số hợp đồng
      const contractNumber = await this.renderContractNumber(submission);

      // Tạo hợp đồng
      const currentDate = new Date();
      const endDate = new Date(currentDate);
      endDate.setMonth(currentDate.getMonth() + 10); // Ngày kết thúc là 10 tháng sau

      await this.contractService.create({
        userId: submission.userId,
        roomNumber: room.roomNumber,
        contractNumber,
        startDate: currentDate,
        endDate,
      });

      // Lưu đơn đăng ký và phòng
      await submission.save();
      await room.save();

      console.log(`Đã xếp sinh viên ${submission.userId} vào phòng ${room.roomNumber} và tạo hợp đồng ${contractNumber}`);
    }
  }

  // chuyển phòng
  async changeRoom(id: string, roomNumber: string): Promise<DormSubmission> {
    // Tìm đơn đăng ký
    const submission = await this.dormSubmissionModel.findById(id);
    if (!submission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }

    // Tìm hợp đồng hiện tại
    const contract = await this.contractModel.findOne({ userId: submission.userId });
    if (!contract) {
      throw new NotFoundException(`Contract for user ID ${submission.userId} not found`);
    }

    // Tìm phòng mới
    const newRoom = await this.roomModel.findOne({ roomNumber });
    if (!newRoom) {
      throw new NotFoundException(`Room with number ${roomNumber} not found`);
    }

    // Cập nhật số chỗ trống của phòng cũ
    const currentRoom = await this.roomModel.findOne({ roomNumber: contract.roomNumber });
    if (currentRoom) {
      // Xóa user khỏi phòng cũ
      currentRoom.users = currentRoom.users.filter(user => user.userId.toString() !== submission.userId.toString());
      console.log('currentRoom.users:', currentRoom.users);
      currentRoom.availableSpot += 1; // Tăng số chỗ trống
      currentRoom.occupied = currentRoom.availableSpot < currentRoom.capacity; // Cập nhật trạng thái
      await currentRoom.save();
    }

    // Cập nhật hợp đồng với số phòng mới
    contract.roomNumber = roomNumber;
    await contract.save();

    // Cập nhật đơn đăng ký
    submission.roomNumber = roomNumber;
    await submission.save();

    // Cập nhật số chỗ trống của phòng mới
    const user = await this.userModel.findOne({ userId: submission.userId });
    newRoom.users.push(user);
    newRoom.availableSpot -= 1; // Giảm số chỗ trống
    newRoom.occupied = newRoom.availableSpot < newRoom.capacity; // Cập nhật trạng thái
    await newRoom.save();

    return submission;
  }



  async autoAssignRoomsByIds(submissionIds: string[]): Promise<void> {
    // Bước 1: Lấy danh sách các phòng có chỗ trống
    const availableRooms = await this.roomModel.find({ availableSpot: { $gt: 0 } });

    // Bước 2: Lấy danh sách các đơn đăng ký đã thanh toán dựa trên ID
    const paidSubmissions = await this.dormSubmissionModel.find({
      _id: { $in: submissionIds },
      status: DormSubmissionStatus.PAID,
    });

    // Bước 3: Xếp sinh viên vào phòng
    for (const submission of paidSubmissions) {
      // Lấy thông tin người dùng để kiểm tra giới tính
      const user = await this.userModel.findOne({ userId: submission.userId });
      if (!user) {
        console.log(`Không tìm thấy người dùng với ID: ${submission.userId}`);
        continue; // Bỏ qua nếu không tìm thấy người dùng
      }

      let room = null;
      const genderPrefix = user.gender === "1" ? "I" : "G"; // Giới tính nam là "I", nữ là "G"

      // Kiểm tra xem có roomNumber hay không
      if (submission.roomNumber) {
        room = await this.roomModel.findOne({
          roomNumber: submission.roomNumber,
          availableSpot: { $gt: 0 },
        });

        // Nếu không tìm thấy phòng cũ hoặc không còn chỗ trống, kiểm tra phòng mới
        if (!room || room.availableSpot <= 0) {
          room = await this.roomModel.findOne({
            roomNumber: new RegExp(`^${genderPrefix}`),
            availableSpot: { $gt: 0 },
          });
        }
      } else {
        // Nếu không có roomNumber, tìm phòng mới
        room = await this.roomModel.findOne({
          roomNumber: new RegExp(`^${genderPrefix}`),
          availableSpot: { $gt: 0 },
        });
      }

      // Nếu không còn phòng trống, dừng lại
      if (!room) {
        console.log('Không còn phòng trống để xếp.');
        break;
      }

      // Cập nhật trạng thái và số phòng cho đơn đăng ký
      submission.status = DormSubmissionStatus.ASSIGNED;
      submission.roomNumber = room.roomNumber;

      // Cập nhật số chỗ trống của phòng
      room.availableSpot -= 1;

      // Tạo số hợp đồng
      const contractNumber = await this.renderContractNumber(submission);

      // Tạo hợp đồng
      const currentDate = new Date();
      const endDate = new Date(currentDate);
      endDate.setMonth(currentDate.getMonth() + 10); // Ngày kết thúc là 10 tháng sau

      await this.contractService.create({
        userId: submission.userId,
        roomNumber: room.roomNumber,
        contractNumber,
        startDate: currentDate,
        endDate,
      });

      // Lưu đơn đăng ký và phòng
      await submission.save();
      await room.save();

      console.log(`Đã xếp sinh viên ${submission.userId} vào phòng ${room.roomNumber} và tạo hợp đồng ${contractNumber}`);
    }
  }

}
