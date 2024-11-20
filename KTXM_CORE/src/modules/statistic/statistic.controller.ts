import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { CreateStatisticDto } from './dto/create-statistic.dto';
import { UpdateStatisticDto } from './dto/update-statistic.dto';
import { Public } from '@/decorator/customize';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) { }

  @Get('available-room')
  @UseInterceptors(CacheInterceptor)
  @Public()
  getAvailableRoom() {
    return this.statisticService.getAvailableRoom();
  }
  @Get('dorm-submission')
  @Public()
  getDormSubmission() {
    return this.statisticService.getDormSubmission();
  }
  @Get('maintenance')
  @Public()
  getMaintenance() {
    return this.statisticService.getMaintenance();
  }

}
