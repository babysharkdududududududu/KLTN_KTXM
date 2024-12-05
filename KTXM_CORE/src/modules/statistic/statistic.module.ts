import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { RoomsModule } from '../rooms/rooms.module';
import { DormSubmissionModule } from '../dorm_submission/dorm_submission.module';
import { StatisticController } from './statistic.controller';
// import { MaintenanceModule } from '../maintenance/maintenance.module'; // Import MaintenanceModule
import { StatisticService } from './statistic.service';
import { MaintenanceModule } from '../maintenance/maintenance.module';
import { MaintenanceSchema } from '../maintenance/entities/maintenance.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { DormPaymentModule } from '../dorm_payment/dorm_payment.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Maintenance', schema: MaintenanceSchema },
    ]),
    RoomsModule,
    CacheModule.register({
      ttl: 10,
    }),
    DormSubmissionModule,
    MaintenanceModule,
    DormPaymentModule,
  ],
  controllers: [StatisticController],
  providers: [StatisticService],
  exports: [StatisticService],
})
export class StatisticModule { }