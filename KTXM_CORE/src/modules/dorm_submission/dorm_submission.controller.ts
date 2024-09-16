import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { DormSubmissionService } from './dorm_submission.service';
import { CreateDormSubmissionDto } from './dto/create-dorm_submission.dto';
import { Public } from '@/decorator/customize';

@Controller('dorm-submission')
export class DormSubmissionController {
  constructor(private readonly dormSubmissionService: DormSubmissionService) { }

  @Post()
  @Public()
  async create(@Body() createDormSubmissionDto: CreateDormSubmissionDto) {
    return await this.dormSubmissionService.create(createDormSubmissionDto);
  }

  @Get()
  async findAll() {
    return await this.dormSubmissionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.dormSubmissionService.findOne(id);
  }

  @Get('setting/:settingId')
  @Public()
  async findBySeting(@Param('settingId') settingId: string) {
    return await this.dormSubmissionService.findBySettingId(settingId);
  }

  @Post('exists')
  @Public()
  async checkSubmissionExists(
    @Body() body: { userId: string; settingId: string },
  ): Promise<{ exists: boolean }> {
    const { userId, settingId } = body;
    const exists = await this.dormSubmissionService.isSubmissionExists(userId, settingId);
    return { exists };
  }
}