import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import mongoose, { Model } from 'mongoose';
import { Room } from './entities/room.entity';
@Injectable()
export class RoomsService {

  constructor(
    @InjectModel(Room.name)
    private roomModel: Model<Room>
  ){}

  checkRoomExist = async (roomNumber: string) => {
    const room = await this.roomModel.exists({ roomNumber });
    if (room) return true;
    return false;
  }


  async create(createRoomDto: CreateRoomDto) {
    const { roomNumber, description, floor, type, block } = createRoomDto;
    const isExist = await this.checkRoomExist(roomNumber);
    if (isExist) {
      throw new BadRequestException(`Phòng đã tồn tại: ${roomNumber}. Vui lòng sử dụng mã phòng khác.`);
    }
    const room = await this.roomModel.create({
      roomNumber, description, floor, type, block
    });
    return {
      _id: room._id
    }
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = await this.roomModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / pageSize);

    const skip = (current - 1) * pageSize;

    const results = await this.roomModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .select("-occupied -price -waterNumber -electricityNumber")
      .sort(sort as any);

    return {
      meta: {
        current: current, // Trang hiện tại
        pageSize: pageSize, // Số lượng bản ghi đã lấy
        pages: totalPages,  // Tổng số trang với điều kiện query
        total: totalItems // Tổng số phần tử (số bản ghi)
      },
      results // Kết quả query
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
    if (updateRoomDto.equipment) {
        room.equipment = updateRoomDto.equipment;
        const beds = room.equipment.find(e => e.name === 'bed');
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


async remove(_id: string) {
  if (mongoose.isValidObjectId(_id)) {
    return this.roomModel.deleteOne({ _id })
  } else {
    throw new BadRequestException("Id không đúng định dạng mongodb")
  }
}
}
