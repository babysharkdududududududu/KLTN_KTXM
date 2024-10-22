import { Injectable } from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting } from './entities/setting.entity';
import { Room } from '@/modules/rooms/entities/room.entity';

@Injectable()
export class SettingService {
  constructor(
    @InjectModel(Setting.name) private settingModel: Model<Setting>,
    @InjectModel(Room.name) private roomModel: Model<Room>, // Sửa đổi ở đây
  ) { }

  async create(createSettingDto: CreateSettingDto) {
    const totalAvailableSpots = await this.calculateAvailableSpots();
    const setting = new this.settingModel({
      ...createSettingDto,
      totalAvailableSpots,
    });
    return setting.save();
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
        throw new Error('Total available spots cannot be negative'); // Thông báo nếu không đủ chỗ
      }
    }
  
    throw new Error('Setting not found');
  }
  
}
