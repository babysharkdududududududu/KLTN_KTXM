import { Module } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { Contract, ContractSchema } from './entities/contract.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomsModule } from '../rooms/rooms.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Contract.name, schema: ContractSchema }]), 
    RoomsModule,
    UsersModule
  ],
  controllers: [ContractsController],
  providers: [ContractsService],
})
export class ContractsModule {}
