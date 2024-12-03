import { Injectable } from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting, SettingDocument } from './entities/setting.entity';
import { Room } from '@/modules/rooms/entities/room.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
@Injectable()
export class SettingService {
  constructor(
    @InjectModel(Setting.name) private settingModel: Model<Setting>,
    @InjectModel(Room.name) private roomModel: Model<Room>, // Sửa đổi ở đây
  ) { }

  async create(createSettingDto: CreateSettingDto) {
    try {
      const totalAvailableSpots = await this.calculateAvailableSpots();
      const setting = new this.settingModel({
        ...createSettingDto,
        totalAvailableSpots,
        firstYearSubmissions: 0,
        upperYearSubmissions: 0,
        prioritySubmissions: 0,
        openPayment: false,
      });
      return await setting.save();
    } catch (error) {
      console.error('Error creating setting:', error);
      throw error; // Ném lại lỗi nếu cần thiết
    }
  }



  async updateSubmissionCount(userId: string) {
    const currentYear = new Date().getFullYear();

    // Lấy 2 ký tự đầu tiên từ userId
    const userYearString = userId.substring(0, 2);
    const userYear = parseInt(userYearString, 10); // Chuyển đổi sang số

    // Tính năm nhập học
    const entryYear = 2000 + userYear; // Thêm 2000 để có năm nhập học

    // Tính toán năm học
    const yearDifference = currentYear - entryYear;

    let submissionsField: 'firstYearSubmissions' | 'upperYearSubmissions';
    let spotsField: 'firstYearSpots' | 'upperYearSpots';

    try {
      if (yearDifference === 0) {
        submissionsField = 'firstYearSubmissions'; // Năm đầu tiên
        spotsField = 'firstYearSpots';
      } else if (yearDifference > 0 && yearDifference <= 3) {
        submissionsField = 'upperYearSubmissions'; // Năm thứ 2, 3, 4
        spotsField = 'upperYearSpots';
      } else {
        throw new Error('Sinh viên đã tốt nghiệp hoặc không hợp lệ');
      }

      // Lấy thông tin Setting
      const setting = await this.settingModel.findOne();

      // Kiểm tra xem có đủ chỗ trống không
      if (setting[spotsField] <= setting[submissionsField]) {
        throw new Error('Đăng ký thất bại: Không đủ chỗ trống');
      }

      // Cập nhật số lượng nộp đơn
      setting[submissionsField] += 1; // Cộng thêm 1 vào trường tương ứng
      await setting.save();
    } catch (error) {
      console.error('Lỗi trong updateSubmissionCount:', error.message);
      // Có thể ghi lại lỗi vào log hoặc xử lý tùy ý ở đây
    }
  }


  async findAll() {
    return this.settingModel.find().exec();
  }

  async findOne(id: string) {
    const setting = await this.settingModel.findById(id).exec();
    if (setting) {
      setting.totalAvailableSpots = await this.calculateAvailableSpots();
      await setting.save();
    }
    return setting;
  }

  async update(id: string, updateSettingDto: UpdateSettingDto) {
    try {
      const totalSpots = updateSettingDto.firstYearSpots + updateSettingDto.upperYearSpots + updateSettingDto.prioritySpots;
      const currentSetting = await this.settingModel.findById(id).exec();

      if (!currentSetting) {
        throw new Error('Cài đặt không tồn tại.');
      }

      if (totalSpots > currentSetting.totalAvailableSpots) {
        throw new Error('Tổng số chỗ trống không được vượt quá tổng số chỗ trống có sẵn.');
      }

      const updatedSetting = await this.settingModel.findByIdAndUpdate(id, updateSettingDto, { new: true }).exec();
      await this.updateAvailableSpots();
      return updatedSetting;
    } catch (error) {
      console.error('Lỗi khi cập nhật cài đặt:', error);
      throw new Error('Đã xảy ra lỗi khi cập nhật cài đặt.');
    }
  }

  private async calculateAvailableSpots() {
    const rooms = await this.roomModel.find().exec();
    return rooms.reduce((total, room) => total + room.availableSpot, 0);
  }

  private async updateAvailableSpots() {
    const availableSpots = await this.calculateAvailableSpots();
    const setting = await this.settingModel.findOne().exec();

    if (setting) {
      setting.totalAvailableSpots = availableSpots;
      await setting.save();
    }
  }

  public async submissionCount(settingId: string) {
    const setting = await this.settingModel.findById(settingId).exec();

    if (setting) {
      if (setting.totalAvailableSpots > 0) {
        setting.totalAvailableSpots -= 1;
        await setting.save();
        return setting;
      } else {
        throw new Error('Total available spots cannot be negative');
      }
    }

    throw new Error('Setting not found');
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    const settings: SettingDocument[] = await this.settingModel.find().exec();
    const now = new Date();
    const nowVietnam = new Date(now.getTime() + 7 * 60 * 60 * 1000); // Thời gian hiện tại ở Việt Nam

    for (const setting of settings) {
      const startDateVietnam = new Date(setting.registrationStartDate);
      const endDateVietnam = new Date(setting.registrationEndDate);

      // Kiểm tra điều kiện mở đăng ký
      if (setting.registrationStatus === 'closed' && nowVietnam >= startDateVietnam && nowVietnam <= endDateVietnam) {
        setting.registrationStatus = 'open'; // Chuyển sang trạng thái mở
        await setting.save(); // Lưu thay đổi
      }

      // Kiểm tra điều kiện đóng đăng ký
      else if (setting.registrationStatus === 'open' && nowVietnam > endDateVietnam) {
        if (nowVietnam > endDateVietnam) {
          setting.registrationStatus = 'closed'; // Đặt lại thành closed
          await setting.save(); // Lưu thay đổi
        }
      }

      // Kiểm tra trạng thái tạm dừng
      if (setting.registrationStatus === 'paused') {
        console.log(`Đăng ký cho ${setting.name} đã bị tạm dừng.`);
      }
    }
  }


  async openRegistration(id: string) {
    const setting = await this.settingModel.findById(id).exec();
    if (!setting) {
      throw new Error('Cài đặt không tồn tại.');
    }

    setting.registrationStatus = 'open'; // Đặt trạng thái thành mở
    await setting.save(); // Lưu thay đổi
    console.log(`Đăng ký cho ${setting.name} đã được mở.`);
    return setting;
  }

  async pauseRegistration(id: string) {
    const setting = await this.settingModel.findById(id).exec();
    if (!setting) {
      throw new Error('Cài đặt không tồn tại.');
    }
    // Chỉ cho phép tạm dừng nếu đang mở
    if (setting.registrationStatus === 'open') {
      setting.registrationStatus = 'paused'; // Đặt trạng thái thành tạm dừng
      await setting.save(); // Lưu thay đổi
      console.log(`Đăng ký cho ${setting.name} đã bị tạm dừng.`);
    } else {
      console.log(`Không thể tạm dừng đăng ký cho ${setting.name} vì nó không đang mở.`);
    }
    return setting;
  }

  async stopRegistration(id: string) {
    const setting = await this.settingModel.findById(id).exec();
    if (!setting) {
      throw new Error('Cài đặt không tồn tại.');
    }

    setting.registrationStatus = 'closed'; // Đặt trạng thái thành closed
    await setting.save(); // Lưu thay đổi
    console.log(`Đăng ký cho ${setting.name} đã dừng.`);
    return setting;
  }
  async isAnySettingOpen(): Promise<boolean> {
    const setting = await this.settingModel.findOne({ registrationStatus: 'open' });
    return !!setting; // Trả về true nếu có setting nào đó đang mở, ngược lại trả về false
  }

  
}
