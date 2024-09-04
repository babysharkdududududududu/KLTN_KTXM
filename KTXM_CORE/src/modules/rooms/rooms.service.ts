import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Room } from './entities/room.entity';
@Injectable()
export class RoomsService {

  constructor(
    @InjectModel(Room.name)
    private roomModel: Model<Room>
  ) { }

  checkRoomExist = async (roomNumber: string) => {
    const room = await this.roomModel.exists({ roomNumber });
    if (room) return true;
    return false;
  }


  async create(createRoomDto: CreateRoomDto) {
    console.log('CreateRoomDto:', createRoomDto); // Log to check

    const { roomNumber, description, floor, type, block, equipment } = createRoomDto;

    // Check if the room already exists
    const isExist = await this.checkRoomExist(roomNumber);
    if (isExist) {
      throw new BadRequestException(`Phòng đã tồn tại: ${roomNumber}. Vui lòng sử dụng mã phòng khác.`);
    }

    // Calculate availableSpot based on equipment
    const bedEquipment = equipment.find(equip => equip.name === 'Giường');
    const availableSpot = bedEquipment ? bedEquipment.quantity * 2 : 0;
    console.log('Available Spot before saving:', availableSpot); // Log to check

    // Create new room
    const room = await this.roomModel.create({
      roomNumber,
      description,
      floor,
      type,
      block,
      equipment,
      availableSpot
    });

    return {
      _id: room._id
    };
  }



  async findAll() {
    const results = await this.roomModel.find().select("-occupied -price -waterNumber -electricityNumber");
    return {
      results
    };
  }


  findOne(roomNumber: string) {
    return this.roomModel.findOne({ roomNumber });
  }

  async update(updateRoomDto: UpdateRoomDto) {
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
      room.equipment = updateRoomDto.equipment;
      const beds = room.equipment.find(e => e.name === 'Giường');
      room.capacity = beds ? beds.quantity * 2 : 0;
      room.availableSpot = beds ? beds.quantity * 2 : 0;
    }
    if (room.capacity - room.availableSpot === room.capacity) {
      room.occupied = true;
    } else {
      room.occupied = false;
    }
    return await room.save();
  }

  async importRooms(roomsData: any[]) {
    const roomData = roomsData.map(room => {
      // Calculate availableSpot based on equipment
      const bedEquipment = room.equipment?.find(equip => equip.name === 'Giường');
      const availableSpot = bedEquipment ? bedEquipment.quantity * 2 : 0;

      return {
        roomNumber: room.roomNumber,
        description: room.description || '',
        floor: room.floor,
        equipment: room.equipment || [],
        type: room.type || '',
        block: room.block,
        capacity: availableSpot, // Use the calculated availableSpot
        availableSpot: availableSpot, // Use the calculated availableSpot
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