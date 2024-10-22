import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Equipment } from './entities/equipment.entity';
import { Model } from 'mongoose';
import { Room } from '../rooms/entities/room.entity';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectModel(Equipment.name)
    private readonly equipmentModel: Model<Equipment>,
    @InjectModel(Room.name)
    private readonly roomModel: Model<Room>
  ) { }

  async create(createEquipmentDto: CreateEquipmentDto) {
    try {
      const isExist = await this.equipmentModel.exists({ equipNumber: createEquipmentDto.equipNumber });
      if (isExist) {
        throw new Error(`Thiết bị đã tồn tại: ${createEquipmentDto.equipNumber}. Vui lòng sử dụng tên khác.`);
      }
      const equipment = new this.equipmentModel(createEquipmentDto);
      return await equipment.save();
    } catch (error) {
      console.error('Error occurred while creating equipment:', error.message);
      throw new InternalServerErrorException('Không thể tạo thiết bị mới. Vui lòng thử lại sau.');
    }
  }

  async importEquipment(equipmentData: any[]): Promise<any[]> {
    const validStatuses = [0, 1, 2, 3, 4, 5]; // Define valid status values

    // Validate each equipment entry
    for (const equipment of equipmentData) {
      if (!validStatuses.includes(equipment.status)) {
        throw new BadRequestException(`Invalid status value: ${equipment.status}`);
      }

      // Additional validation if needed
      // Example: Check if required fields are present
      if (!equipment.equipNumber || !equipment.name) {
        throw new BadRequestException(`Missing required fields in equipment data.`);
      }
    }

    const equipmentDataToInsert = equipmentData.map(equipment => ({
      equipNumber: equipment.equipNumber,
      name: equipment.name || '',
      status: equipment.status || 0,
      startDate: equipment.startDate || new Date(),
      endDate: equipment.endDate || null,
      fixedDate: equipment.fixedDate || null,
      location: equipment.location || '',
      roomNumber: equipment.roomNumber
    }));

    try {
      return await this.equipmentModel.insertMany(equipmentDataToInsert);
    } catch (error) {
      console.error('Error importing equipment:', error);
      throw error;
    }
  }
  findAll(roomNumber: string) {
    const rs = this.equipmentModel.find({ roomNumber });
    return rs;
  }

  findAllEquipments() {
    return this.equipmentModel.find();
  }

  async findOne(roomNumber: string) {
    return this.equipmentModel.findOne({ roomNumber }).exec();
  }

  async update(equipmentNumber: string, updateEquipmentDto: UpdateEquipmentDto) {
    const equip = await this.equipmentModel.findOne({ equipNumber: equipmentNumber });
    if (!equip) {
      throw new BadRequestException(`Equipment not found: ${equipmentNumber}`);
    }
    if (updateEquipmentDto.roomNumber) {
      equip.roomNumber = updateEquipmentDto.roomNumber;
    }
    Object.assign(equip, updateEquipmentDto, { equipNumber: equipmentNumber });
    equip.location.push(`phòng ${updateEquipmentDto.roomNumber}`);
    await equip.save();
    return equip;
  }


  remove(id: number) {
    return `This action removes a #${id} equipment`;
  }
}
