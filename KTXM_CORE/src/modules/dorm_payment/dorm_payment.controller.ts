import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DormPaymentService } from './dorm_payment.service';
import { CreateDormPaymentDto } from './dto/create-dorm_payment.dto';
import { UpdateDormPaymentDto } from './dto/update-dorm_payment.dto';
import { Public } from '@/decorator/customize';

@Controller('dorm-payment')
export class DormPaymentController {
  constructor(private readonly dormPaymentService: DormPaymentService) { }

  @Post()
  @Public()
  create(@Body() createDormPaymentDto: CreateDormPaymentDto) {
    return this.dormPaymentService.create(createDormPaymentDto);
  }
  @Get(':userId')
  @Public()
  async getPaymentsByUser(@Param('userId') userId: string) {
    try {
      const payments = await this.dormPaymentService.getDormPaymentsByUserId(userId);
      return {
        error: 0,
        message: 'Success',
        data: payments,
      };
    } catch (error) {
      return {
        error: -1,
        message: error.message,
        data: null,
      };
    }
  }


  @Get()
  findAll() {
    return this.dormPaymentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dormPaymentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDormPaymentDto: UpdateDormPaymentDto) {
    return this.dormPaymentService.update(+id, updateDormPaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dormPaymentService.remove(+id);
  }
}
