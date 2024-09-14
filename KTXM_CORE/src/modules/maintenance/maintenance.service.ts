import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { Maintenance, MaintenanceDocument } from './entities/maintenance.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Room, RoomDocument } from '../rooms/entities/room.entity';
import { log } from 'node:console';
import { Equipment, EquipmentDocument } from '../equipment/entities/equipment.entity';

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectModel(Maintenance.name) private maintenanceModel: Model<MaintenanceDocument>,
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    @InjectModel(Equipment.name) private equipmentModel: Model<EquipmentDocument>,
  ) { }

  // async create(createMaintenanceDto: CreateMaintenanceDto): Promise<Maintenance> {
  //   const { roomNumber, item } = createMaintenanceDto;

  //   const room = await this.roomModel.findOne({ roomNumber });
  //   console.log(room, 'roomNumber');

  //   const equipment = await this.equipmentModel.find({ roomNumber });
  //   console.log(equipment, 'equipment');

  //   if (!room) {
  //     throw new NotFoundException(`Room with number ${createMaintenanceDto.roomNumber} not found`);
  //   }

  //   const equipmentIndex = equipment.findIndex(eq => eq.equipNumber === item);

  //   if (equipmentIndex === -1) {
  //     throw new NotFoundException(`Item with equipNumber ${item} not found in room ${roomNumber}`);
  //   }

  //   equipment[equipmentIndex].status = createMaintenanceDto.status;

  //   // await this.roomModel.updateOne(
  //   //   { roomNumber, "equipment.name": item },
  //   //   { $set: { "equipment.$.status": createMaintenanceDto.status } }
  //   // );
  //   await this.equipmentModel.updateOne({
  //     roomNumber,
  //     equipNumber: item,
  //   }, {
  //     status: createMaintenanceDto.status,
  //   });



  //   const createdMaintenance = new this.maintenanceModel({
  //     ...createMaintenanceDto,
  //     roomNumber,
  //     reportedAt: new Date(),
  //     statusHistory: [{ status: createMaintenanceDto.status, updatedAt: new Date() }],
  //   });

  //   return createdMaintenance.save();
  // }
  async create(createMaintenanceDto: CreateMaintenanceDto): Promise<Maintenance> {
    const { roomNumber, item, status } = createMaintenanceDto;

    const room = await this.roomModel.findOne({ roomNumber }).exec();
    if (!room) {
      throw new NotFoundException(`Room with number ${roomNumber} not found`);
    }

    const equipment = await this.equipmentModel.findOne({ roomNumber, equipNumber: item }).exec();
    console.log(equipment, 'equipment');

    if (!equipment) {
      throw new NotFoundException(`Item with equipNumber ${item} not found in room ${roomNumber}`);
    }

    equipment.status = status;
    equipment.fixedDate = new Date();
    equipment.repairNumber = (equipment.repairNumber || 0) + 1;

    // Add repair date to repairHistory
    equipment.repairHistory = equipment.repairHistory || [];
    equipment.repairHistory.push(equipment.fixedDate);

    // Update equipment info
    await this.equipmentModel.updateOne(
      { roomNumber, equipNumber: item },
      {
        $set: {
          status: equipment.status,
          fixedDate: equipment.fixedDate,
          repairNumber: equipment.repairNumber,
          repairHistory: equipment.repairHistory,
        }
      }
    ).exec();

    const createdMaintenance = new this.maintenanceModel({
      ...createMaintenanceDto,
      roomNumber,
      reportedAt: new Date(),
      statusHistory: [{ status, updatedAt: new Date() }],
    });

    return createdMaintenance.save();
  }



  // async updateByMaintenanceNumber(maintenanceNumber: string, updateMaintenanceDto: UpdateMaintenanceDto): Promise<Maintenance> {
  //   const maintenance = await this.maintenanceModel.findOne({ maintenanceNumber });
  //   if (!maintenance) {
  //     throw new NotFoundException(`Maintenance with number ${maintenanceNumber} not found`);
  //   }

  //   const { roomNumber, item } = updateMaintenanceDto;

  //   if (roomNumber) {
  //     const room = await this.roomModel.findOne({ roomNumber });
  //     if (!room) {
  //       throw new NotFoundException(`Room with number ${roomNumber} not found`);
  //     }

  //     const equipmentIndex = room.equipment.findIndex(eq => eq.name === item);
  //     if (equipmentIndex === -1) {
  //       throw new NotFoundException(`Item with name ${item} not found in room ${roomNumber}`);
  //     }

  //     room.equipment[equipmentIndex].status = updateMaintenanceDto.status;
  //     await this.roomModel.updateOne(
  //       { roomNumber, "equipment.name": item },
  //       { $set: { "equipment.$.status": updateMaintenanceDto.status } }
  //     );
  //   }

  //   let newStatus: number;

  //   if (updateMaintenanceDto.status !== undefined) {
  //     switch (maintenance.status) {
  //       case 1:
  //         if (updateMaintenanceDto.status !== 2) {
  //           throw new BadRequestException('Invalid status transition from 1');
  //         }
  //         newStatus = 2;
  //         break;
  //       case 2:
  //         if (updateMaintenanceDto.status !== 3) {
  //           throw new BadRequestException('Invalid status transition from 2');
  //         }
  //         newStatus = 3;
  //         break;
  //       case 3:
  //         if (updateMaintenanceDto.status !== 4) {
  //           throw new BadRequestException('Invalid status transition from 3');
  //         }
  //         newStatus = 4;
  //         break;
  //       case 4:
  //         if (![5, 6].includes(updateMaintenanceDto.status)) {
  //           throw new BadRequestException('Invalid status transition from 4');
  //         }
  //         newStatus = updateMaintenanceDto.status;
  //         break;
  //       default:
  //         throw new BadRequestException('Invalid current status');
  //     }
  //     maintenance.status = newStatus;
  //   }

  //   maintenance.statusHistory.push({ status: newStatus, updatedAt: new Date() });

  //   if (updateMaintenanceDto.maintenanceNumber !== undefined) {
  //     maintenance.maintenanceNumber = updateMaintenanceDto.maintenanceNumber;
  //   }
  //   if (updateMaintenanceDto.item !== undefined) {
  //     maintenance.item = updateMaintenanceDto.item;
  //   }
  //   if (updateMaintenanceDto.roomNumber !== undefined) {
  //     maintenance.roomNumber = updateMaintenanceDto.roomNumber;
  //   }

  //   return this.maintenanceModel.findOneAndUpdate({ maintenanceNumber }, maintenance, { new: true });
  // }

  async updateByMaintenanceNumber(maintenanceNumber: string, updateMaintenanceDto: UpdateMaintenanceDto): Promise<Maintenance> {
    const maintenance = await this.maintenanceModel.findOne({ maintenanceNumber });
    if (!maintenance) {
      throw new NotFoundException(`Maintenance with number ${maintenanceNumber} not found`);
    }

    const { roomNumber, item } = updateMaintenanceDto;

    if (roomNumber && item) {
      const room = await this.roomModel.findOne({ roomNumber });
      if (!room) {
        throw new NotFoundException(`Room with number ${roomNumber} not found`);
      }

      const equipment = await this.equipmentModel.findOne({ roomNumber, equipNumber: item });
      if (!equipment) {
        throw new NotFoundException(`Item with equipNumber ${item} not found in room ${roomNumber}`);
      }

      // Cập nhật trạng thái thiết bị
      equipment.status = updateMaintenanceDto.status;

      if (updateMaintenanceDto.status === 1) {
        equipment.fixedDate = new Date();
        equipment.repairNumber = (equipment.repairNumber || 0) + 1;
        equipment.repairHistory = equipment.repairHistory || [];
        equipment.repairHistory.push(new Date());
      }

      // Cập nhật thiết bị
      await this.equipmentModel.updateOne(
        { roomNumber, equipNumber: item },
        {
          status: equipment.status,
          fixedDate: equipment.fixedDate,
          repairNumber: equipment.repairNumber,
          repairHistory: equipment.repairHistory,
        }
      );
    }

    let newStatus: number;

    if (updateMaintenanceDto.status !== undefined) {
      switch (maintenance.status) {
        case 1:
          if (updateMaintenanceDto.status !== 2) {
            throw new BadRequestException('Invalid status transition from 1');
          }
          newStatus = 2;
          break;
        case 2:
          if (updateMaintenanceDto.status !== 3) {
            throw new BadRequestException('Invalid status transition from 2');
          }
          newStatus = 3;
          break;
        case 3:
          if (updateMaintenanceDto.status !== 4) {
            throw new BadRequestException('Invalid status transition from 3');
          }
          newStatus = 4;
          break;
        case 4:
          if (![5, 6].includes(updateMaintenanceDto.status)) {
            throw new BadRequestException('Invalid status transition from 4');
          }
          newStatus = updateMaintenanceDto.status;
          break;
        default:
          throw new BadRequestException('Invalid current status');
      }
      maintenance.status = newStatus;
      maintenance.statusHistory.push({ status: newStatus, updatedAt: new Date() }); // Cập nhật lịch sử trạng thái
    }

    // Cập nhật các trường khác nếu có
    if (updateMaintenanceDto.maintenanceNumber !== undefined) {
      maintenance.maintenanceNumber = updateMaintenanceDto.maintenanceNumber;
    }
    if (updateMaintenanceDto.item !== undefined) {
      maintenance.item = updateMaintenanceDto.item;
    }
    if (updateMaintenanceDto.roomNumber !== undefined) {
      maintenance.roomNumber = updateMaintenanceDto.roomNumber;
    }

    return this.maintenanceModel.findOneAndUpdate({ maintenanceNumber }, maintenance, { new: true });
  }





  findAll() {
    return this.maintenanceModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} maintenance`;
  }

  remove(id: number) {
    return `This action removes a #${id} maintenance`;
  }
}
