import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Room } from './entities/room.entity';
import { Equipment } from '../equipment/entities/equipment.entity';
import { log } from 'console';
@Injectable()
export class RoomsService {

  constructor(
    @InjectModel(Room.name)
    private roomModel: Model<Room>,
    // private equipmentModel: Model<Equipment>
  ) { }

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

  async calculateAvailableRooms() {
    const rooms = await this.roomModel.find().exec();
    let totalAvailableRooms = 0;

    console.log('Rooms:', rooms);
    rooms.forEach(room => {
      totalAvailableRooms += room.availableSpot;
    });

    console.log('Total Available Rooms:', totalAvailableRooms);
    return {
      totalAvailableRooms,
      rooms
    }
  }


}