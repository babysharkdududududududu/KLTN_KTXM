import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
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
    CacheModule.register({
      ttl: 10000,
    }), // CacheModule mới
  ],
  controllers: [RoomsController],
  providers: [RoomsService, EquipmentService],
  exports: [RoomsService, MongooseModule],
})
export class RoomsModule { }
