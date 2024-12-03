import { Room, RoomSchema } from '@/modules/rooms/entities/room.entity';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { StudentDiscipline, StudentDisciplineSchema } from '../student-discipline/entities/student-discipline.entity';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, { name: StudentDiscipline.name, schema: StudentDisciplineSchema }, { name: Room.name, schema: RoomSchema }]),
  CacheModule.register({
    ttl: 10,
  }),],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule { }
