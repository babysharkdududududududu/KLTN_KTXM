import { Module } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { EquipmentController } from './equipment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Equipment, EquipmentSchema } from './entities/equipment.entity';
import { RoomsService } from '../rooms/rooms.service';
import { Room, RoomSchema } from '../rooms/entities/room.entity';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Equipment.name, schema: EquipmentSchema },
      { name: Room.name, schema: RoomSchema }
    ]),
  ],
  controllers: [EquipmentController],
  providers: [EquipmentService, RoomsService],
  exports: [EquipmentService]
})
export class EquipmentModule { }
