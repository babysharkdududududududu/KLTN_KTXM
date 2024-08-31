import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SettingService } from './setting.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Setting } from './entities/setting.entity'; // Đường dẫn đến entity Setting
import { Public, ResponseMessage } from '@/decorator/customize';
@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Post()
  @Public()
  async create(@Body() createSettingDto: CreateSettingDto): Promise<Setting> {
    return this.settingService.create(createSettingDto);
  }

  @Get()
  @Public()
  async findAll(): Promise<Setting[]> {
    return this.settingService.findAll();
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string): Promise<Setting> {
    return this.settingService.findOne(id);
  }

  @Patch(':id')
  @Public()
  async update(@Param('id') id: string, @Body() updateSettingDto: UpdateSettingDto): Promise<Setting> {
    return this.settingService.update(id, updateSettingDto);
  }

}
