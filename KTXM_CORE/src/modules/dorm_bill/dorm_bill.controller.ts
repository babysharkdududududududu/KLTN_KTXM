import { Controller, Get, Post, Patch, Param, Delete, Body } from '@nestjs/common';
import { DormBillService } from './dorm_bill.service';
import { BillType } from './entities/dorm_bill.entity';
import { Public } from '@/decorator/customize';

@Controller('dorm-bill')
export class DormBillController {
  constructor(private readonly dormBillService: DormBillService) {}

  @Post()
  async create() {
    // Gọi phương thức tạo hóa đơn tự động từ service
    return this.dormBillService.handleCreateMonthlyBills();
  }

  @Get()
  findAll() {
    return this.dormBillService.findAll();
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
  
}
