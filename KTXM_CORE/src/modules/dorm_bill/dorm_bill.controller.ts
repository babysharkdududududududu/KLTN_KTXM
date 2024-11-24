import { Controller, Get, Post, Patch, Param, Delete, Body, Query } from '@nestjs/common';
import { DormBillService } from './dorm_bill.service';
import { BillType, PaymentStatus, DormBill } from './entities/dorm_bill.entity';
import { Public } from '@/decorator/customize';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

@Controller('dorm-bill')
export class DormBillController {
  constructor(private readonly dormBillService: DormBillService) {}

  @Get('search')
  @Public()
  async findAll(
    @Query('season') season: string,
    @Query('roomNumber') roomNumber: string,
    @Query('monthAndYear') monthAndYear: string,
    @Query('status') status: PaymentStatus,
    @Query('billType') billType: BillType,
  ): Promise<DormBill[]> {
    return this.dormBillService.findAll({ roomNumber, monthAndYear, status, billType, season });
  }

  @Post()
  async create() {
    // Gọi phương thức tạo hóa đơn tự động từ service
    return this.dormBillService.handleCreateMonthlyBills();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dormBillService.findOne(+id);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dormBillService.remove(+id);
  }

  @Post("/webhook")
  @Public()
  async webhook(@Body() body: any) { // Thêm @Body() để lấy dữ liệu từ yêu cầu
    // Gọi phương thức xử lý webhook từ service và truyền body vào
    return this.dormBillService.handleWebhook(body);
  }

  @Get("/room/:roomNumber")
  @Public()
  async findAllByRoomNumber(@Param('roomNumber') roomNumber: string) {
    return this.dormBillService.findAllByRoomNumber(roomNumber);
  }


}


