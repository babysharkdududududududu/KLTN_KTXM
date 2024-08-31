import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { Maintenance } from './entities/maintenance.entity';
import { Public } from '@/decorator/customize';

@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) { }


  @Get()
  @Public()
  findAll() {
    return this.maintenanceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.maintenanceService.findOne(+id);
  }

  @Post()
  @Public()
  async create(@Body() createMaintenanceDto: CreateMaintenanceDto): Promise<Maintenance> {
    return this.maintenanceService.create(createMaintenanceDto);
  }

  @Patch(':maintenanceNumber')
  @Public()
  async update(@Param('maintenanceNumber') maintenanceNumber: string, @Body() updateMaintenanceDto: UpdateMaintenanceDto): Promise<Maintenance> {
    return this.maintenanceService.updateByMaintenanceNumber(maintenanceNumber, updateMaintenanceDto);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.maintenanceService.remove(+id);
  }
}
