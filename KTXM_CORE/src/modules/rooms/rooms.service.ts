import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import { Model } from 'mongoose';
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

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
