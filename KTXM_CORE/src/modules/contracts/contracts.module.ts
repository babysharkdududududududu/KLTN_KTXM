import { Module } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { Contract, ContractSchema } from './entities/contract.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomsModule } from '../rooms/rooms.module';
import { UsersModule } from '../users/users.module';
import { Room, RoomSchema } from '../rooms/entities/room.entity';
import { RoomsService } from '../rooms/rooms.service';
import { use } from 'passport';
import { UsersService } from '../users/users.service';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Contract.name, schema: ContractSchema }, { name: Room.name, schema: RoomSchema }, { name: User.name, schema: UserSchema }]),
    RoomsModule,
    UsersModule
  ],
  controllers: [ContractsController],
  providers: [ContractsService, RoomsService, UsersService],
})
export class ContractsModule { }
