import { Controller, Get, Post, Body, Param, Query, Patch, Res, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DormSubmissionService } from './dorm_submission.service';
import { CreateDormSubmissionDto } from './dto/create-dorm_submission.dto';
import { Public } from '@/decorator/customize';
import { DormSubmissionStatus, DormSubmission } from './entities/dorm_submission.entity';
import { Response } from 'express';
import { multerConfig } from '../../config/multer.config'
@Controller('dorm-submission')
export class DormSubmissionController {
  constructor(private readonly dormSubmissionService: DormSubmissionService) { }


  @Get('export')
  @Public()
  async exportSubmissions(
    @Query('status') status: DormSubmissionStatus,
    @Query('settingId') settingId: string,
    @Res() res: Response, // Đảm bảo kiểu Response được nhập đúng
  ): Promise<void> {
    const buffer = await this.dormSubmissionService.exportSubmissions(status, settingId);

    // Đặt tên file và kiểu nội dung
    const fileName = `dorm_submissions_${new Date().toISOString().split('T')[0]}.xlsx`;

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });

    res.send(buffer); // Gửi buffer về client
  }
  @Post()
  @Public()
  @UseInterceptors(FilesInterceptor('files', 10, multerConfig)) // Sử dụng multerConfig
  async create(
      @Body() createDormSubmissionDto: CreateDormSubmissionDto,
      @UploadedFiles() files: Express.Multer.File[], // Nhận mảng file đã tải lên
  ) {
      // Lấy tên file từ mảng files
      const fileNames = files.map(file => file.filename);

      // Gọi service để lưu vào cơ sở dữ liệu
      return await this.dormSubmissionService.create({
          ...createDormSubmissionDto,
          documents: fileNames, // Thêm mảng tên file vào DTO
      });
  }

  @Get()
  @Public()
  async findAll() {
    return await this.dormSubmissionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.dormSubmissionService.findOne(id);
  }

  @Get('user/:userId')
  @Public()
  async findByUser(@Param('userId') userId: string) {
    return await this.dormSubmissionService.findOneWithUserId(userId);
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
  // search dorm submission with user id and setting id
  @Get('search/:userId')
  @Public()
  async search(
    @Param('userId') userId: string,
  ): Promise<DormSubmission> {
    return this.dormSubmissionService.findBySettingIdAndUserId(userId);
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
  // chuyển phòng
  @Patch('change-room/:id')
  @Public()
  async changeRoom(
    @Param('id') id: string,
    @Body('roomNumber') roomNumber: string,
  ): Promise<DormSubmission> {
    return this.dormSubmissionService.changeRoom(id, roomNumber);
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