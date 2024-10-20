import { Public } from '@/decorator/customize';
import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { EquipmentService } from '../equipment/equipment.service';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomsService } from './rooms.service';
import { CacheInterceptor } from '@nestjs/cache-manager';
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService, private readonly equipmentService: EquipmentService) { }

  // @Post()
  // @Public()
  // create(@Body() createRoomDto: CreateRoomDto) {
  //   return this.roomsService.create(createRoomDto);
  // }

  @Get()
  @Public()
  @UseInterceptors(CacheInterceptor)
  async findAll() {
    return this.roomsService.findAll();
  }



  @Get('getAvailableRooms')
  @Public()
  async getAvailableRooms() {
    return this.roomsService.getAvailableRooms();
  }
  @Get(':roomNumber')
  @Public()
  async findOne(@Param('roomNumber') roomNumber: string) {
    const room = await this.roomsService.findOne(roomNumber);
    const equipment = await this.equipmentService.findAll(roomNumber);
    console.log('equipment:', equipment);
    return {
      equipment: equipment || null,
      room: room || null,
    };
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

  @Post('import')
  @Public()
  async importUsers(@Body() usersData: any[]) {
    if (!Array.isArray(usersData) || usersData.length === 0) {
      throw new BadRequestException('Invalid data');
    }
    return this.roomsService.importRooms(usersData);
  }
}
