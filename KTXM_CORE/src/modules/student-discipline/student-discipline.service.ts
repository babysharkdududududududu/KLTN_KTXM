import { PenaltyType, StudentDisciplineDocument } from './entities/student-discipline.entity';
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

  // Tạo mới hoặc cập nhật kỷ luật sinh viên
  async create(createStudentDisciplineDto: CreateStudentDisciplineDto): Promise<StudentDiscipline> {
    const { userId, violationDate, penalty, descriptions } = createStudentDisciplineDto;
    try {
      const student = await this.studentModel.findOne({ userId }).exec();
      if (!student) {
        console.log(`Student not found for userId: ${userId}`);
        throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }

      const existingDiscipline = await this.studentDisciplineModel.findOne({ student: student.userId }).exec();

      if (existingDiscipline) {
        if (existingDiscipline.violationCount < 3) {
          existingDiscipline.violationCount += 1;
          existingDiscipline.violationDate = violationDate;
          existingDiscipline.penalty = penalty;
          if (descriptions) {
            existingDiscipline.descriptions.push(...descriptions);
          }
          return await existingDiscipline.save();
        } else if (existingDiscipline.violationCount === 3) {
          existingDiscipline.isReviewed = true;
          existingDiscipline.penalty = PenaltyType.REVIEW_FORM;
          existingDiscipline.violationCount += 1;
          if (descriptions) {
            existingDiscipline.descriptions.push(...descriptions);
          }
          return await existingDiscipline.save();
        } else if (existingDiscipline.violationCount > 3) {
          existingDiscipline.violationCount = 1;
          existingDiscipline.violationDate = violationDate;
          existingDiscipline.penalty = penalty;
          existingDiscipline.descriptions = descriptions || [];
          return await existingDiscipline.save();
        }
      }

      const newDiscipline = new this.studentDisciplineModel({
        student: student.userId,
        violationDate,
        penalty,
        descriptions: descriptions || [],
        violationCount: 1,
        isReviewed: false,
      });

      return await newDiscipline.save();
    } catch (error) {
      console.error('Failed to create or update student discipline', error.message, error.stack);
      throw new HttpException('Could not create or update student discipline', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  // Lấy tất cả thông tin sinh viên cùng với kỷ luật
  findAll() {
    return `This action returns all studentDiscipline`;
  }

  findOne(studentId: string) {
    const studentDiscipline = this.studentDisciplineModel.findOne({ student: studentId }).exec();
    return studentDiscipline;
  }

  update(id: number, updateStudentDisciplineDto: UpdateStudentDisciplineDto) {
    return `This action updates a #${id} studentDiscipline`;
  }

  remove(id: number) {
    return `This action removes a #${id} studentDiscipline`;
  }
}
