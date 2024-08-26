import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { Contract } from './entities/contract.entity';
import { Room } from '../rooms/entities/room.entity';
import { RoomsService } from '../rooms/rooms.service';
import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class ContractsService {
  constructor(@InjectModel(Contract.name)
  private contractModel: Model<Contract>,
    private readonly roomsService: RoomsService,
    private readonly usersService: UsersService,
    @InjectModel(Room.name)
    private roomModel: Model<Room>,
    @InjectModel(User.name)
    private userModal: Model<User>
  ) { }

  checkUserRoomExist = async (userId: string, roomNumber: string): Promise<boolean> => {
    const currentDateTime = new Date();
    const user = await this.usersService.findByUserId(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    const room = await this.roomsService.findOne(roomNumber);
    if (!room) {
      throw new NotFoundException(`Room with ID ${roomNumber} not found`);
    }
    const exitContract = await this.contractModel.findOne({ userId }).exec();
    console.log(exitContract);
    if (exitContract) {
      if (exitContract.endDate > currentDateTime) {
        return false;
      }
    }
    console.log(`No active contract for user: ${userId}`);
    return true;
  }

  async create(createContractDto: CreateContractDto): Promise<Contract> {
    const { contractNumber, userId, roomNumber } = createContractDto;

    // Kiểm tra nếu người dùng đã có hợp đồng còn hiệu lực
    const isExist = await this.checkUserRoomExist(userId, roomNumber);
    if (!isExist) {
      throw new NotFoundException('Người dùng đã có hợp đồng còn hiệu lực');
    }

    // Tìm phòng
    const room = await this.roomModel.findOne({ roomNumber });

    if (!room) {
      throw new NotFoundException('Phòng không tồn tại');
    }

    // Kiểm tra phòng còn chỗ trống
    if (room.availableSpot <= 0) {
      throw new BadRequestException('Phòng đã hết chỗ trống');
    }

    // Giảm availableSpot và cập nhật lại phòng
    room.availableSpot -= 1;
    await room.save();

    // Tạo hợp đồng
    const currentDate = new Date();
    const endDate = new Date(currentDate);
    endDate.setMonth(currentDate.getMonth() + 10);

    const contract = await this.contractModel.create({
      contractNumber,
      userId,
      roomNumber,
      startDate: currentDate,
      endDate,
    });

    return contract;
  }


  async findAll(): Promise<Contract[]> {
    return this.contractModel.find().exec();
  }

  async findOneBy(criteria: { userId?: string; roomNumber?: string; contractNumber?: string }): Promise<Contract[]> {
    const query: any = {};

    if (criteria.userId) {
      query.userId = criteria.userId;
    }
    if (criteria.roomNumber) {
      query.roomNumber = criteria.roomNumber;
    }
    if (criteria.contractNumber) {
      query.contractNumber = criteria.contractNumber;
    }

    const contracts = await this.contractModel.find(query).exec();

    if (contracts.length === 0) {
      throw new NotFoundException(`No contracts found with the provided criteria`);
    }

    return contracts;
  }

  async update(id: string, updateContractDto: UpdateContractDto) {
    const updatedContract = await this.contractModel.findByIdAndUpdate(id, updateContractDto, { new: true }).exec();
    if (!updatedContract) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }
    return updatedContract;
  }

  async remove(id: string) {
    const result = await this.contractModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }
  }

  async findOne(id: string) {
    const contract = await this.contractModel.findById(id).exec();
    if (!contract) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }
    return contract;
  }
  async findContractByUserId(userId: string) {
    return this.contractModel.findOne({ userId });
  }
  async findUserByUserId(userId: string) {
    return this.userModal.findOne({ userId });
  }
  async findRoomByRoomNumber(roomNumber: string) {
    return this.roomModel.findOne({ roomNumber });
  }


  async findUserWithContract(userId: string) {
    const user = await this.findUserByUserId(userId);
    const contract = await this.findContractByUserId(userId);

    if (!user || !contract) {
      throw new Error('User or contract not found');
    }
    return {
      user,
      contract,
    };
  }
  async findUserAndRoomWithContract(userId: string, roomNumber: string) {
    const user = await this.findUserByUserId(userId);
    const contract = await this.findContractByUserId(userId);

    if (!user || !contract) {
      throw new Error('User or contract not found');
    }

    const room = await this.findRoomByRoomNumber(roomNumber);

    if (!room) {
      throw new Error('Room not found');
    }

    return {
      user,
      contract,
      room,
    };
  }



}
