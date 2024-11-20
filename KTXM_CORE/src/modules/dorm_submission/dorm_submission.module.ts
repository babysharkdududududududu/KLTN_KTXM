import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DormSubmissionController } from './dorm_submission.controller';
import { DormSubmissionService } from './dorm_submission.service';
import { DormSubmission, DormSubmissionSchema } from './entities/dorm_submission.entity';

import { ContractsModule } from '../contracts/contracts.module';
import { ContractsService } from '../contracts/contracts.service';
import { Contract, ContractSchema } from '../contracts/entities/contract.entity';
import { Room, RoomSchema } from '../rooms/entities/room.entity';
import { RoomsModule } from '../rooms/rooms.module';
import { Setting, SettingSchema } from '../setting/entities/setting.entity';
import { SettingModule } from '../setting/setting.module';
import { SettingService } from '../setting/setting.service';
import { StudentDiscipline, StudentDisciplineSchema } from '../student-discipline/entities/student-discipline.entity';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { DormPayment, DormPaymentSchema } from '../dorm_payment/entities/dorm_payment.entity';
import { DormPaymentService } from '../dorm_payment/dorm_payment.service';
import { DormPaymentModule } from '../dorm_payment/dorm_payment.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DormSubmission.name, schema: DormSubmissionSchema },
      { name: Setting.name, schema: SettingSchema },
      { name: User.name, schema: UserSchema },
      { name: Contract.name, schema: ContractSchema },
      { name: StudentDiscipline.name, schema: StudentDisciplineSchema },
      { name: Room.name, schema: RoomSchema },
      { name: DormPayment.name, schema: DormPaymentSchema }

    ]),
    SettingModule,
    ContractsModule,
    UsersModule,
    RoomsModule,
    DormPaymentModule
  ],
  controllers: [DormSubmissionController],
  providers: [DormSubmissionService, SettingService, UsersService, ContractsService, DormPaymentService],
  exports: [DormSubmissionService],
})
export class DormSubmissionModule { }

