import { Module } from '@nestjs/common';
import { StudentDisciplineService } from './student-discipline.service';
import { StudentDisciplineController } from './student-discipline.controller';
import { StudentDiscipline, StudentDisciplineSchema } from './entities/student-discipline.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from '../users/users.controller';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StudentDiscipline.name, schema: StudentDisciplineSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [StudentDisciplineController],
  providers: [StudentDisciplineService],
})
export class StudentDisciplineModule { }

