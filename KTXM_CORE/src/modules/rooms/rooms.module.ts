import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './entities/room.entity';
import { Equipment, EquipmentSchema } from '@/modules/equipment/entities/equipment.entity';
import { EquipmentService } from '../equipment/equipment.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Room.name, schema: RoomSchema },
      { name: Equipment.name, schema: EquipmentSchema },
    ]),
  ],
  controllers: [RoomsController],
  providers: [RoomsService, EquipmentService],
  exports: [RoomsService],
})
export class RoomsModule { }
