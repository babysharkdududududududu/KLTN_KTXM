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
    @InjectModel(Room.name) private roomModel: Model<Room>,
  ) { }

  async create(createSettingDto: CreateSettingDto) {
    // Lấy số giường trống
    const totalAvailableSpots = await this.calculateAvailableSpots();
    const setting = new this.settingModel(createSettingDto);

    setting.totalAvailableSpots = totalAvailableSpots;

    setting.firstYearSpots = (totalAvailableSpots * createSettingDto.firstYearRatio)/100;
    setting.upperYearSpots = (totalAvailableSpots * createSettingDto.upperYearRatio)/100;
    setting.prioritySpots = (totalAvailableSpots * createSettingDto.priorityRatio)/100;

    return setting.save();
  }

  async findAll() {
    const settings = await this.settingModel.find().exec();
    return settings;
  }

  async findOne(id: string) {
    return this.settingModel.findById(id).exec();
  }

  async update(id: string, updateSettingDto: UpdateSettingDto) {
    return this.settingModel.findByIdAndUpdate(id, updateSettingDto, { new: true }).exec();
  }

  async calculateAvailableSpots() {
    const rooms = await this.roomModel.find().exec();
    let totalAvailableSpots = 0;

    rooms.forEach(room => {
      totalAvailableSpots += room.availableSpot;
    });

    return totalAvailableSpots;
  }

  async updateAvailableSpots() {
    const availableSpots = await this.calculateAvailableSpots();
    const settings = await this.settingModel.find().exec();

    settings.forEach(setting => {
      setting.totalAvailableSpots = availableSpots;
      setting.save();
    });
  }
}
