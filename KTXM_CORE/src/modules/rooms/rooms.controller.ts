import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Public, ResponseMessage } from '@/decorator/customize';
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @Public()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Get()
  @Public()
  async findAll(
    @Query('query') query: string, 
    @Query('current') current: number,
    @Query('pageSize') pageSize: number
  ) {
    return this.roomsService.findAll(query, current, pageSize);
  }

  @Get(':roomNumber') // Sửa ':id' thành ':roomNumber'
  async findOne(@Param('roomNumber') roomNumber: string) {
    return this.roomsService.findOne(roomNumber); // Gọi đúng phương thức findOne
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(+id);
  }
}
