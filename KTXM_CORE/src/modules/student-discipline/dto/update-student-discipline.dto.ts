import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentDisciplineDto } from './create-student-discipline.dto';

export class UpdateStudentDisciplineDto extends PartialType(CreateStudentDisciplineDto) {}
