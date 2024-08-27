import { Controller, Get, Post, Body, Patch, Param, Delete, Query, NotFoundException } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { Contract } from './entities/contract.entity';
import { Public, ResponseMessage } from '@/decorator/customize';
import { DeleteContractDto } from './dto/delete-contract.dto';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) { }

  @Post()
  @Public()
  create(@Body() createContractDto: CreateContractDto) {
    return this.contractsService.create(createContractDto);
  }

  @Get()
  @Public()
  findAll(): Promise<Contract[]> {
    return this.contractsService.findAll();
  }

  @Get('search')
  @Public()
  findOneBy(
    @Query('userId') userId?: string,
    @Query('roomNumber') roomNumber?: string,
    @Query('contractNumber') contractNumber?: string
  ): Promise<Contract[]> {
    return this.contractsService.findOneBy({ userId, roomNumber, contractNumber });
  }

  @Get(':userId')
  @Public()
  async findUserWithContract(@Param('userId') userId: string) {
    return this.contractsService.findUserWithContract(userId);
  }
  @Get(':userId/room')
  @Public()
  async findUserAndRoomWithContract(
    @Param('userId') userId: string,
    @Query('roomNumber') roomNumber: string
  ) {
    try {
      return this.contractsService.findUserAndRoomWithContract(userId, roomNumber);
    } catch (error) {
      throw new NotFoundException('User, contract, or room not found');
    }
  }

  @Patch(':id')
  @Public()
  update(@Param('id') id: string, @Body() updateContractDto: UpdateContractDto): Promise<Contract> {
    return this.contractsService.update(id, updateContractDto);
  }

  @Delete(':id')
  @Public()
  async remove(@Param('id') id: string, @Body() deleteContractDto: DeleteContractDto): Promise<void> {
    await this.contractsService.remove(id, deleteContractDto);
  }

  @Post('extend/:contractNumber')
  @Public()
  async extendContract(@Param('contractNumber') contractNumber: string) {
    try {
      const extendedContract = await this.contractsService.contractExtension(contractNumber);
      return extendedContract;
    } catch (error) {
      throw new NotFoundException(`Could not find contract with contractNumber: ${contractNumber}`);
    }
  }

}
