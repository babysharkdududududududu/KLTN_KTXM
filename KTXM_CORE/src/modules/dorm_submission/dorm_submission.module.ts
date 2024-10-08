import { Module } from '@nestjs/common';
import { DormSubmissionService } from './dorm_submission.service';
import { DormSubmissionController } from './dorm_submission.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DormSubmission, DormSubmissionSchema } from './entities/dorm_submission.entity';

import { SettingService } from '../setting/setting.service';
import { SettingModule } from '../setting/setting.module';
import { Setting, SettingSchema } from '../setting/entities/setting.entity';
import { RoomsModule } from '../rooms/rooms.module';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { ContractsService } from '../contracts/contracts.service';
import { ContractsModule } from '../contracts/contracts.module';
import { Contract, ContractSchema } from '../contracts/entities/contract.entity';
import { Room, RoomSchema } from '../rooms/entities/room.entity';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DormSubmission.name, schema: DormSubmissionSchema },
      { name: Setting.name, schema: SettingSchema },
      { name: User.name, schema: UserSchema },
      { name: Contract.name, schema: ContractSchema },
      { name: Room.name, schema: RoomSchema }
    ]),
    SettingModule,
    ContractsModule,
    UsersModule,
    RoomsModule
  ],
  controllers: [DormSubmissionController],
  providers: [DormSubmissionService, SettingService, UsersService, ContractsService],
  exports: [DormSubmissionService],
})
export class DormSubmissionModule { }

