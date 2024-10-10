import { StudentDisciplineDocument } from './entities/student-discipline.entity';
import { StudentDiscipline } from './entities/student-discipline.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStudentDisciplineDto } from './dto/create-student-discipline.dto';
import { UpdateStudentDisciplineDto } from './dto/update-student-discipline.dto';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class StudentDisciplineService {
  constructor(
    @InjectModel(User.name) private studentModel: Model<UserDocument>,

    @InjectModel(StudentDiscipline.name) private studentDisciplineModel: Model<StudentDisciplineDocument>,
  ) { }

  async create(createStudentDisciplineDto: CreateStudentDisciplineDto): Promise<StudentDiscipline> {
    const { userId, violationType, violationDate, penalty, description } = createStudentDisciplineDto;
    try {
      const student = await this.studentModel.findOne({ userId }).exec();
      if (!student) {
        console.log(`Student not found for userId: ${userId}`);
        throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }
      const existingDiscipline = await this.studentDisciplineModel.findOne({ student: student._id }).exec();
      if (existingDiscipline) {
        if (existingDiscipline.violationCount < 3) {
          existingDiscipline.violationCount += 1;
          return await existingDiscipline.save();
        }
        else if (existingDiscipline.violationCount === 3) {
          existingDiscipline.isReviewed = true;
          existingDiscipline.violationCount = 0;
          return await existingDiscipline.save();
        }
        else {
          throw new HttpException('Student has reached the maximum violation count', HttpStatus.BAD_REQUEST);
        }

      }
      const newDiscipline = new this.studentDisciplineModel({
        student: student._id,
        violationType,
        violationDate,
        penalty,
        description,
        violationCount: 1,
        isReviewed: false,
      });

      return await newDiscipline.save();
    } catch (error) {
      console.log('Failed to create or update student discipline', error);
      throw new HttpException('Could not create or update student discipline', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }






  findAll() {
    return `This action returns all studentDiscipline`;
  }

  findOne(id: number) {
    return `This action returns a #${id} studentDiscipline`;
  }

  update(id: number, updateStudentDisciplineDto: UpdateStudentDisciplineDto) {
    return `This action updates a #${id} studentDiscipline`;
  }

  remove(id: number) {
    return `This action removes a #${id} studentDiscipline`;
  }
}
