import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { Contract } from './entities/contract.entity';
import { Room } from '../rooms/entities/room.entity';
import { RoomsService } from '../rooms/rooms.service';
import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { DeleteContractDto } from './dto/delete-contract.dto';
import { SettingService } from '../setting/setting.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Setting } from '../setting/entities/setting.entity';

@Injectable()
export class ContractsService {
  constructor(@InjectModel(Contract.name)
  private contractModel: Model<Contract>,
    private readonly roomsService: RoomsService,
    private readonly usersService: UsersService,

    @InjectModel(Room.name)
    private roomModel: Model<Room>,

    @InjectModel(User.name)
    private userModal: Model<User>,

    private readonly settingService: SettingService
  ) { }
  private settingId = '66d567a0ebb9cd93566389a9';

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    const setting: Setting = await this.settingService.findOne(this.settingId);

    if (setting) {
      const now = new Date();
      const nowVietnam = new Date(now.getTime() + 7 * 60 * 60 * 1000);
      const startDate = new Date(setting.registrationStartDate);
      const endDate = new Date(setting.registrationEndDate);

      const startDateVietnam = new Date(startDate.getTime() + 7 * 60 * 60 * 1000);
      const endDateVietnam = new Date(endDate.getTime() + 7 * 60 * 60 * 1000);

      if (nowVietnam >= startDateVietnam && nowVietnam <= endDateVietnam) {
        console.log('Thời gian hiện tại nằm trong khoảng thời gian đăng ký.');
      } else {
        console.log('Thời gian hiện tại không nằm trong khoảng thời gian đăng ký.');
      }
    } else {
      console.error('Không tìm thấy setting với ID:', this.settingId);
    }
  }


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

  async remove(id: string, deleteContractDto: DeleteContractDto) {
    const contract = await this.contractModel.findById(id).exec();
    if (!contract) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }

    const room = await this.roomModel.findOne({ roomNumber: contract.roomNumber });
    if (!room) {
      throw new NotFoundException(`Room with roomNumber ${contract.roomNumber} not found`);
    }

    const userIndex = room.users.findIndex(user => user.userId === deleteContractDto.userId);
    if (userIndex === -1) {
      throw new NotFoundException(`User with userId ${deleteContractDto.userId} not found in room ${contract.roomNumber}`);
    }

    room.users.splice(userIndex, 1);
    room.availableSpot += 1;

    await Promise.all([room.save(), this.contractModel.deleteOne({ _id: id }).exec()]);

    return { message: 'Delete contract and user successfully' };
  }


  async create(createContractDto: CreateContractDto): Promise<Contract> {
    const { contractNumber, userId, roomNumber } = createContractDto;

    const isExist = await this.checkUserRoomExist(userId, roomNumber);
    if (!isExist) {
      throw new NotFoundException('Người dùng đã có hợp đồng còn hiệu lực');
    }

    const room = await this.roomModel.findOne({ roomNumber });

    if (!room) {
      throw new NotFoundException('Phòng không tồn tại');
    }

    if (room.availableSpot <= 0) {
      throw new BadRequestException('Phòng đã hết chỗ trống');
    }

    room.availableSpot -= 1;
    const user = await this.findUserByUserId(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    room.users.push(user);
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

  async contractExtension(contractNumber: string) {
    const contract = await this.contractModel.findOne({ contractNumber }).exec();
    if (!contract) {
      throw new NotFoundException(`Contract with contractNumber ${contractNumber} not found`);
    }
    const endDate = new Date(contract.endDate);
    endDate.setMonth(endDate.getMonth() + 10);
    contract.endDate = endDate;
    await contract.save();
    return contract;
  }


  async findOne(id: string) {
    try {
      const contract = await this.contractModel.findById(id).exec();
      if (!contract) {
        throw new NotFoundException(`Contract with ID ${id} not found`);
      }
      return contract;
    } catch (error) {
      console.error('Error in findOne:', error.message);
      throw error;
    }
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
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const contract = await this.findContractByUserId(userId);
    if (!contract) {
      throw new NotFoundException(`Contract for User ID ${userId} not found`);
    }

    return {
      user,
      contract,
    };
  }

  async findUserAndRoomWithContract(userId: string, roomNumber: string) {
    try {
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
    } catch (error) {
      console.error('Error in findUserAndRoomWithContract:', error.message);
      throw error;
    }
  }
  // check contract
  async getLatestRoomByUserId(userId: string): Promise<string> {
    const latestContract = await this.contractModel
      .findOne({ userId })
      .sort({ startDate: -1 })
      .exec();
    if (!latestContract) {
      return "No";
    }
    return latestContract.roomNumber;
  }
}
