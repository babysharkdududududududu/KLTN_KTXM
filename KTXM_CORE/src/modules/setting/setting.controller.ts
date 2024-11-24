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

  
  @Get('is-open')
  @Public()
  async checkIfSettingIsOpen(): Promise<boolean> {
      return this.settingService.isAnySettingOpen();
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

  // openRegistration
  @Patch('openRegistration/:id')
  @Public()
  async openRegistration(@Param('id') id: string): Promise<Setting> {
    return this.settingService.openRegistration(id);
  }

  // pauseRegistration
  @Patch('pauseRegistration/:id')
  @Public()
  async pauseRegistration(@Param('id') id: string): Promise<Setting> {
    return this.settingService.pauseRegistration(id);
  }


}
