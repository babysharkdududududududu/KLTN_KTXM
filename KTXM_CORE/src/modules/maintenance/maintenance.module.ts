import { Maintenance, MaintenanceSchema } from './entities/maintenance.entity';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceController } from './maintenance.controller';
import { Room, RoomSchema } from '../rooms/entities/room.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Maintenance.name, schema: MaintenanceSchema }, { name: Room.name, schema: RoomSchema }])],
  providers: [MaintenanceService],
  controllers: [MaintenanceController],
})
export class MaintenanceModule { }
