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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DormSubmission.name, schema: DormSubmissionSchema },
      { name: Setting.name, schema: SettingSchema },
      {name: User.name, schema: UserSchema},
    ]),
    SettingModule,
    RoomsModule,
  ],
  controllers: [DormSubmissionController],
  providers: [DormSubmissionService, SettingService, UsersService],
  exports: [DormSubmissionService],
})
export class DormSubmissionModule {}
