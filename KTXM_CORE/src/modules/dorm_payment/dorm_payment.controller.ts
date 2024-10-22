import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { Response } from 'express';
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
  @Get('payment/callback')
  @Public()
  async callback(@Query() query: any, @Res() res: Response) {
    try {
      const paymentResponse = await this.dormPaymentService.handlePaymentCallback(query, res);
      return res.status(200).json({
        error: 0,
        message: 'Success',
        data: paymentResponse,
      });
    } catch (error) {
      console.error('Error in payment callback:', error);
      return res.status(500).json({
        error: -1,
        message: error.message,
        data: null,
      });
    }
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
