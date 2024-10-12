import { Type } from 'class-transformer';
import { PenaltyType, ViolationType } from './../entities/student-discipline.entity';
import { IsString, IsEnum, IsDate, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

class DescriptionDto {
    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    violationDate: Date;

    @IsNotEmpty()
    @IsEnum(ViolationType, { message: 'violationType must be one of the following values: Giờ giấc, Vệ sinh' })
    violationType: ViolationType;
}

export class CreateStudentDisciplineDto {
    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    violationDate: Date;

    @IsNotEmpty()
    @IsEnum(PenaltyType)
    penalty: PenaltyType;

    @IsOptional()
    @IsArray()
    descriptions?: DescriptionDto[];
}
