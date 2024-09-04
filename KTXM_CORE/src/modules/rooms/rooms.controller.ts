import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Public, ResponseMessage } from '@/decorator/customize';
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) { }

  @Post()
  @Public()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Get()
  @Public()
  async findAll() {
    return this.roomsService.findAll();
  }


  @Get(':roomNumber')
  @Public()
  async findOne(@Param('roomNumber') roomNumber: string) {
    return this.roomsService.findOne(roomNumber);
  }

  @Patch()
  @Public()
  update(@Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(updateRoomDto);
  }

  @Delete(':id')
  @Public()
  remove(@Param('id') id: string) {
    return this.roomsService.remove(id);
  }

  @Get('hihihihi')
  @Public()
  async findAvailableRooms() {
    console.log('findAvailableRooms called'); // Log để kiểm tra
    return {
      statusCode: 200,
      message: 'Hello from rooms module',
      data: null // Hoặc có thể là dữ liệu bạn muốn trả về
    };
  }
  @Post('import')
  @Public()
  async importUsers(@Body() usersData: any[]) {
    // Kiểm tra dữ liệu trước khi nhập
    if (!Array.isArray(usersData) || usersData.length === 0) {
      throw new BadRequestException('Invalid data');
    }
    return this.roomsService.importRooms(usersData);
  }
}
