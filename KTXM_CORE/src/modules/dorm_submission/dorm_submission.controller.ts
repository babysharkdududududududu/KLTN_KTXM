import { Controller, Get, Post, Body, Param, Query, Patch } from '@nestjs/common';
import { DormSubmissionService } from './dorm_submission.service';
import { CreateDormSubmissionDto } from './dto/create-dorm_submission.dto';
import { Public } from '@/decorator/customize';
import { DormSubmission } from './entities/dorm_submission.entity';

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

  //chấp nhận đơn đăng ký
  @Patch('accept/:id')
  @Public()
  async acceptSubmission(@Param('id') id: string): Promise<DormSubmission> {
    return this.dormSubmissionService.acceptSubmission(id);
  }

  //từ chối đơn đăng ký
  @Patch('reject/:id')
  @Public()
  async rejectSubmission(@Param('id') id: string): Promise<DormSubmission> {
    return this.dormSubmissionService.rejectSubmission(id);
  }

  //chờ thanh toán
  @Patch('awaiting-payment/:id')
  @Public()
  async setAwaitingPayment(@Param('id') id: string): Promise<DormSubmission> {
    return this.dormSubmissionService.setAwaitingPayment(id);
  }
  // set all Accepted to Awaiting Payment
  @Patch('awaiting-payment-all/:settingId') // Nếu muốn truyền qua params
  @Public()
  async setAllAwaitingPayment(@Param('settingId') settingId: string): Promise<DormSubmission[]> {
      return this.dormSubmissionService.setAwaitingPaymentAll(settingId);
  }

  //đã thanh toán
  @Patch('paid/:id')
  @Public()
  async setPaid(@Param('id') id: string): Promise<DormSubmission> {
    return this.dormSubmissionService.setPaid(id);
  }
  @Patch('room-assigned/:id')
  @Public()
  async setRoomAssigned(
    @Param('id') id: string,
    @Body('roomNumber') roomNumber: string, // Thêm roomNumber vào body
  ): Promise<DormSubmission> {
    return this.dormSubmissionService.setRoomAssigned(id, roomNumber);
  }

  // Tự động xếp phòng
  @Post('auto-assign-rooms')
  @Public()
  async autoAssignRooms(): Promise<{ message: string }> {
    try {
      await this.dormSubmissionService.autoAssignRooms();
      return { message: 'Đã xếp phòng cho tất cả sinh viên có đơn đăng ký.' };
    } catch (error) {
      console.error('Lỗi khi xếp phòng:', error);
      throw new Error('Có lỗi xảy ra khi xếp phòng.');
    }
  }
  @Post('auto-assign-room-by-ids')
  @Public()
  async autoAssignRoomsByIds(@Body('submissionIds') submissionIds: string[]): Promise<{ message: string }> {
    try {
      await this.dormSubmissionService.autoAssignRoomsByIds(submissionIds);
      return { message: 'Đã xếp phòng cho các sinh viên có đơn đăng ký.' };
    } catch (error) {
      console.error('Lỗi khi xếp phòng:', error);
      throw new Error('Có lỗi xảy ra khi xếp phòng.');
    }
  }

}