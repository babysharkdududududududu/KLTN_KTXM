import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { Public } from '@/decorator/customize';

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
}
