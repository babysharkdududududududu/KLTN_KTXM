import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '@/decorator/customize';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @Public()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Public()
  async findAll() {
    return this.usersService.findAll();
  }


  @Patch()
  @Public()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Get('id/:userId')
  @Public()
  async findByUserId(@Param('userId') userId: string) {
    return this.usersService.findByUserId(userId);
  }
  @Post('check-users')
  @Public()
  async checkUsers(@Body() body: { userIds: string[] }) {
    const existingUsers = await this.usersService.checkExistingUsers(body.userIds);
    return existingUsers; // Trả về danh sách các userId đã tồn tại
  }

  @Post('import')
  @Public()
  async importUsers(@Body() usersData: any[]) {
    // Kiểm tra dữ liệu trước khi nhập
    if (!Array.isArray(usersData) || usersData.length === 0) {
      throw new BadRequestException('Invalid data');
    }
    return this.usersService.importUsers(usersData);
  }

}
