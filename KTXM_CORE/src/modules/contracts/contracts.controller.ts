import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { Contract } from './entities/contract.entity';
import { Public, ResponseMessage } from '@/decorator/customize';
@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

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

  @Patch(':id')
  @Public()
  update(@Param('id') id: string, @Body() updateContractDto: UpdateContractDto): Promise<Contract> {
    return this.contractsService.update(id, updateContractDto);
  }

  @Delete(':id')
  @Public()
  remove(@Param('id') id: string): Promise<void> {
    return this.contractsService.remove(id);
  }
}
