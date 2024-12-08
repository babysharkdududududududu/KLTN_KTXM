import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, Query, Res } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { Public } from '@/decorator/customize';
import { Response } from 'express';
@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) { }

  @Post()
  @Public()
  create(@Body() createEquipmentDto: CreateEquipmentDto) {
    return this.equipmentService.create(createEquipmentDto);
  }

  @Get('/roomNumber/:roomNumber')
  @Public()
  findAll(@Param('roomNumber') roomNumber: string) {
    return this.equipmentService.findAll(roomNumber);
  }

  @Get(':roomNumber')
  @Public()
  findOne(@Param('roomNumber') roomNumber: string) {
    return this.equipmentService.findOne(roomNumber);
  }
  @Patch(':equipmentNumber')
  @Public()
  update(@Param('equipmentNumber') equipmentNumber: string, @Body() updateEquipmentDto: UpdateEquipmentDto
  ) {
    return this.equipmentService.update(equipmentNumber, updateEquipmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.equipmentService.remove(+id);
  }
  @Get()
  @Public()
  findAllEquipments() {
    return this.equipmentService.findAllEquipments();
  }

  @Post('import')
  @Public()
  async importUsers(@Body() equipData: any[]) {
    // Kiểm tra dữ liệu trước khi nhập
    if (!Array.isArray(equipData) || equipData.length === 0) {
      throw new BadRequestException('Invalid data');
    }
    return this.equipmentService.importEquipment(equipData);
  }
// Server-side
@Get('export')
@Public()
async exportEquipmentData(@Res() res: Response): Promise<void> {
  try {
    const buffer = await this.equipmentService.exportEquipmentData();

    // Thiết lập tiêu đề và loại content cho file Excel
    res.set({
      'Content-Disposition': 'attachment; filename="equipment_data.xlsx"',
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // Gửi buffer về cho client
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi khi xuất dữ liệu thiết bị');
  }
}
}
