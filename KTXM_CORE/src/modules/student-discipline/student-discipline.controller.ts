import { Controller, Post, Body, Get, Patch, Param, Delete } from '@nestjs/common';
import { StudentDisciplineService } from './student-discipline.service';
import { CreateStudentDisciplineDto } from './dto/create-student-discipline.dto';
import { StudentDiscipline } from './entities/student-discipline.entity';
import { UpdateStudentDisciplineDto } from './dto/update-student-discipline.dto';
import { Public } from '@/decorator/customize';

@Controller('student-discipline')
export class StudentDisciplineController {
  constructor(private readonly studentDisciplineService: StudentDisciplineService) { }

  @Post()
  @Public()
  async create(@Body() createStudentDisciplineDto: CreateStudentDisciplineDto): Promise<StudentDiscipline> {
    return this.studentDisciplineService.create(createStudentDisciplineDto);
  }
  @Get()
  findAll() {
    return this.studentDisciplineService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentDisciplineService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDisciplineDto: UpdateStudentDisciplineDto) {
    return this.studentDisciplineService.update(+id, updateStudentDisciplineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentDisciplineService.remove(+id);
  }
}
