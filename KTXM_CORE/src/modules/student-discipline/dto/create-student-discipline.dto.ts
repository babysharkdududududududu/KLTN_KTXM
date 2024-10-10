import { Type } from 'class-transformer';
import { PenaltyType, ViolationType } from './../entities/student-discipline.entity';
import { IsString, IsEnum, IsDate, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateStudentDisciplineDto {
    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsEnum(ViolationType)
    violationType: ViolationType;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    violationDate: Date;

    @IsNotEmpty()
    @IsEnum(PenaltyType)
    penalty: PenaltyType;

    @IsOptional()
    @IsString()
    description?: string;
}
