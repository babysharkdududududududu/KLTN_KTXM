import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Equipment } from './entities/equipment.entity';
import { Model } from 'mongoose';
import { Room } from '../rooms/entities/room.entity';
import * as ExcelJS from 'exceljs';
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
      roomNumber: equipment.roomNumber,
      brand: equipment.brand || '',
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

  async findAllEquipmentsStatistic() {
    const equipments = await this.equipmentModel.aggregate([
      {
        $group: {
          _id: '$name',
          items: { $push: '$$ROOT' },
        },
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          count: { $size: '$items' },
        },
      },
    ]);
    console.log(equipments);

    return equipments;
  }
  async findAllEquipments() {
    return this.equipmentModel.find();
  }
  async findAllEquipmentsWithNumberRoom() {
    const equipments = await this.equipmentModel.find();

    // Nhóm theo mã phòng
    const groupedByRoom = equipments.reduce((acc, equipment) => {
      const roomNumber = equipment.roomNumber;
      if (!acc[roomNumber]) {
        acc[roomNumber] = [];
      }
      acc[roomNumber].push(equipment);
      return acc;
    }, {});

    return groupedByRoom;
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

  // Service
  async exportEquipmentData(): Promise<Buffer> {
    const equipments = await this.equipmentModel.find({}).exec();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Equipment Data');

    // Đặt tên cột
    worksheet.columns = [
      { header: 'Equipment Number', key: 'equipNumber', width: 30 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Status', key: 'status', width: 10 },
      { header: 'Start Date', key: 'startDate', width: 20 },
      { header: 'End Date', key: 'endDate', width: 20 },
      { header: 'Fixed Date', key: 'fixedDate', width: 20 },
      { header: 'Location', key: 'location', width: 50 },
      { header: 'Room Number', key: 'roomNumber', width: 30 },
      { header: 'Repair Number', key: 'repairNumber', width: 10 },
    ];

    // Thêm dữ liệu vào worksheet
    equipments.forEach((equipment) => {
      worksheet.addRow({
        equipNumber: equipment.equipNumber,
        name: equipment.name,
        status: equipment.status,
        startDate: equipment.startDate,
        endDate: equipment.endDate,
        fixedDate: equipment.fixedDate,
        location: equipment.location ? equipment.location.join(', ') : '',
        roomNumber: equipment.roomNumber,
        repairNumber: equipment.repairNumber,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer as Buffer;
  }
}
