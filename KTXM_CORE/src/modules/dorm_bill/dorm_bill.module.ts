import { Module } from '@nestjs/common';
import { DormBillService } from './dorm_bill.service';
import { DormBillController } from './dorm_bill.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { DormBill, DormBillSchema } from './entities/dorm_bill.entity';
import { Room, RoomSchema } from '../rooms/entities/room.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DormBill.name, schema: DormBillSchema }, { name: Room.name, schema: RoomSchema }]),
  ],
  controllers: [DormBillController],
  providers: [DormBillService],
  exports: [DormBillService]
})
export class DormBillModule {}
