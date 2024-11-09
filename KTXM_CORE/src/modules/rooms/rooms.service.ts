import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Room } from './entities/room.entity';
import { Equipment } from '../equipment/entities/equipment.entity';
import { log } from 'console';

import axios from 'axios';
import crypto from 'crypto';

@Injectable()
export class RoomsService {

  private readonly BASE_URL = "https://openapi.tuyaus.com";
  private readonly LOGIN_URL = "/v1.0/token?grant_type=1";
  private readonly ATTRIBUTES_URL = "/v2.0/cloud/thing/{device_id}/shadow/properties";


  constructor(
    @InjectModel(Room.name)
    private roomModel: Model<Room>,
    // private equipmentModel: Model<Equipment>
  ) {
    this.startFetchingData();
  }

  checkRoomExist = async (roomNumber: string) => {
    const room = await this.roomModel.exists({ roomNumber });
    if (room) return true;
    return false;
  }


  // async create(createRoomDto: CreateRoomDto) {
  //   console.log('CreateRoomDto:', createRoomDto); 

  //   const { roomNumber, description, floor, type, block, equipment } = createRoomDto;

  //   const isExist = await this.checkRoomExist(roomNumber);
  //   if (isExist) {
  //     throw new BadRequestException(`Phòng đã tồn tại: ${roomNumber}. Vui lòng sử dụng mã phòng khác.`);
  //   }

  //   const bedEquipment = equipment.find(equip => equip.name === 'Giường');
  //   const availableSpot = bedEquipment ? bedEquipment.quantity * 2 : 0;
  //   console.log('Available Spot before saving:', availableSpot);

  //   // Create new room
  //   const room = await this.roomModel.create({
  //     roomNumber,
  //     description,
  //     floor,
  //     type,
  //     block,
  //     equipment,
  //     availableSpot
  //   });

  //   return {
  //     _id: room._id
  //   };
  // }
  // async create(createRoomDto: CreateRoomDto) {
  //   const { roomNumber, description, floor, type, block, equipment } = createRoomDto;

  //   const isExist = await this.checkRoomExist(roomNumber);
  //   if (isExist) {
  //     throw new BadRequestException(`Phòng đã tồn tại: ${roomNumber}. Vui lòng sử dụng mã phòng khác.`);
  //   }

  //   // Tìm các thiết bị theo ObjectId
  //   const equipmentIds = await this.equipmentModel.find({
  //     _id: { $in: equipment.map(e => e._id) }
  //   });

  //   const bedEquipment = equipmentIds.find(equip => equip.name === 'Giường');
  //   const availableSpot = bedEquipment ? bedEquipment.quantity * 2 : 0;

  //   // Tạo phòng mới với danh sách equipment
  //   const room = await this.roomModel.create({
  //     roomNumber,
  //     description,
  //     floor,
  //     type,
  //     block,
  //     equipment: equipmentIds.map(e => e._id), // Lưu ObjectId của Equipment
  //     availableSpot
  //   });

  //   return { _id: room._id };
  // }

  async findAll() {
    const results = await this.roomModel.find().select("-occupied -price -waterNumber -electricityNumber");
    return {
      results
    };
  }

  findOne(roomNumber: string) {
    const a = this.roomModel.findOne({ roomNumber });
    return a;
  }

  async update(updateRoomDto: UpdateRoomDto) {
    try {
      const room = await this.roomModel.findById(updateRoomDto._id);

      if (!room) {
        throw new Error("Phòng không tồn tại");
      }
      if (updateRoomDto.description) {
        room.description = updateRoomDto.description;
      }
      if (updateRoomDto.type) {
        room.type = updateRoomDto.type;
      }
      if (updateRoomDto.price) {
        room.price = updateRoomDto.price;
      }
      if (updateRoomDto.waterNumber) {
        room.waterNumber = updateRoomDto.waterNumber;
      }
      if (updateRoomDto.electricityNumber) {
        room.electricityNumber = updateRoomDto.electricityNumber;
      }
      if (updateRoomDto.status !== null && updateRoomDto.status !== undefined) {
        room.status = updateRoomDto.status;
      }
      if (updateRoomDto.availableSpot !== null && updateRoomDto.availableSpot !== undefined) {
        room.availableSpot = updateRoomDto.availableSpot;
      }
      if (updateRoomDto.equipment) {
        const equipmentMap = new Map();

        room.equipment.forEach(e => {
          equipmentMap.set(e.name, Number(e.quantity));
        });
        updateRoomDto.equipment.forEach(e => {
          if (equipmentMap.has(e.name)) {
            equipmentMap.set(e.name, equipmentMap.get(e.name) + Number(e.quantity));
          } else {
            equipmentMap.set(e.name, Number(e.quantity));
          }
        });
        room.equipment = Array.from(equipmentMap.entries()).map(([name, quantity]) => ({ name, quantity, status: 0 }));
        const beds = room.equipment.find(e => e.name === 'Giường');
        room.capacity = beds ? beds.quantity * 2 : 0;
        room.availableSpot = beds ? beds.quantity * 2 : 0;
      }
      room.occupied = (room.capacity - room.availableSpot === room.capacity);
      return await room.save();
    } catch (error) {
      console.error("Error updating room:", error.message);
      throw new Error("Cập nhật phòng thất bại");
    }
  }


  async importRooms(roomsData: any[]) {
    const roomData = roomsData.map(room => {
      const bedEquipment = room.equipment?.find(equip => equip.name === 'Giường');
      const availableSpot = bedEquipment ? bedEquipment.quantity * 2 : 0;
      return {
        roomNumber: room.roomNumber,
        description: room.description || '',
        floor: room.floor,
        equipment: room.equipment || [],
        type: room.type || '',
        block: room.block,
        capacity: 16,
        availableSpot: 16,
        occupied: room.occupied || false,
        price: room.price || '',
        waterNumber: room.waterNumber || '',
        electricityNumber: room.electricityNumber || '',
        status: 0
      };
    });

    try {
      const resolvedRooms = await Promise.all(roomData);
      return this.roomModel.insertMany(resolvedRooms);
    } catch (error) {
      console.error('Error importing rooms:', error);
      throw error;
    }
  }


  async remove(_id: string) {
    if (mongoose.isValidObjectId(_id)) {
      return this.roomModel.deleteOne({ _id })
    } else {
      throw new BadRequestException("Id không đúng định dạng mongodb")
    }
  }
  async getAvailableRooms() {
    const rooms = await this.roomModel.find({ availableSpot: { $gt: 0 } });
    const availableRooms = rooms.reduce((total, room) => total + room.availableSpot, 0);
    return availableRooms;
  }
  // update electric and water number
  async updateElectricAndWaterNumber(roomNumber: string, waterNumber: number, electricityNumber: number) {
    const room = await this.roomModel
      .findOneAndUpdate({ roomNumber }, { waterNumber, electricityNumber }, { new: true });
    return room;
  }

  // update electric number
  private async makeRequest(url: string, headers: any) {
    try {
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      console.error("Error making request:", error.response ? error.response.data : error.message);
      throw error;
    }
  }

  private getTimestamp() {
    return Math.floor(Date.now()).toString();
  }

  private getSign(payload: string, key: string) {
    return crypto.createHmac('sha256', key).update(payload).digest('hex').toUpperCase();
  }

  private async getAccessToken() {
    const timestamp = this.getTimestamp();
    const stringToSign = `${this.client_id}${timestamp}GET\ne3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\n\n${this.LOGIN_URL}`;
    const sign = this.getSign(stringToSign, this.client_secret);

    const headers = {
      "client_id": this.client_id,
      "sign": sign,
      "t": timestamp,
      "mode": "cors",
      "sign_method": "HMAC-SHA256",
      "Content-Type": "application/json"
    };

    const response = await this.makeRequest(`${this.BASE_URL}${this.LOGIN_URL}`, headers);
    return response.result.access_token;
  }

  private async getDeviceProperties(access_token: string, device_id: string) {
    const url = this.ATTRIBUTES_URL.replace("{device_id}", device_id);
    const timestamp = this.getTimestamp();
    const stringToSign = `${this.client_id}${access_token}${timestamp}GET\ne3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\n\n${url}`;
    const sign = this.getSign(stringToSign, this.client_secret);

    const headers = {
      "client_id": this.client_id,
      "sign": sign,
      "access_token": access_token,
      "t": timestamp,
      "mode": "cors",
      "sign_method": "HMAC-SHA256",
      "Content-Type": "application/json"
    };

    const response = await this.makeRequest(`${this.BASE_URL}${url}`, headers);
    return response.result.properties.reduce((acc, prop) => {
      acc[prop.code] = prop.value;
      return acc;
    }, {});
  }

  private async fetchAndUpdateElectricityNumber() {
    const rooms = await this.roomModel.find(); // Lấy tất cả các phòng

    try {
      const access_token = await this.getAccessToken();
      for (const room of rooms) {
        const deviceId = room.electricityId; // Lấy deviceId từ thông tin phòng
        if (!deviceId) {
          room.electricityNumber = 0; // Đặt electricityNumber bằng 0 nếu không có deviceId
          await room.save(); // Lưu lại thay đổi
          continue; // Bỏ qua phòng này
        }

        const attributes = await this.getDeviceProperties(access_token, deviceId);
        const rawElectricityNumber = attributes.ele; // Lấy giá trị thô
        room.electricityNumber = this.formatElectricityNumber(rawElectricityNumber); // Cập nhật electricityNumber
        await room.save(); // Lưu lại thay đổi
      }
    } catch (error) {
      console.error("Error fetching or updating electricity number:", error.message);
    }
  }

  // Hàm định dạng số điện
  private formatElectricityNumber(rawNumber: number): number {
    return parseFloat((rawNumber / 1000).toFixed(3)); // Chia cho 1000 và định dạng với 3 chữ số thập phân
  }

  private startFetchingData() {
    this.fetchAndUpdateElectricityNumber(); // Gọi ngay lần đầu
    setInterval(() => {
      this.fetchAndUpdateElectricityNumber();
    }, 30 * 60 * 1000); // 30 phút
  }
}