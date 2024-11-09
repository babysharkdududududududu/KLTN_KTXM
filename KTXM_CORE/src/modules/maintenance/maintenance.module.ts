import { Maintenance, MaintenanceSchema } from './entities/maintenance.entity';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceController } from './maintenance.controller';
import { Equipment, Room, RoomSchema } from '../rooms/entities/room.entity';
import { EquipmentSchema } from '../equipment/entities/equipment.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Maintenance.name, schema: MaintenanceSchema }, { name: Room.name, schema: RoomSchema }, { name: Equipment.name, schema: EquipmentSchema }])],
  providers: [MaintenanceService],
  controllers: [MaintenanceController],
  exports: [MaintenanceService]
})
export class MaintenanceModule { }
