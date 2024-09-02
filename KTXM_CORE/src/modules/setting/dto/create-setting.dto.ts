import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateSettingDto {
    @IsNumber()
    @IsNotEmpty()
    firstYearRatio: number;

    @IsNumber()
    @IsNotEmpty()
    upperYearRatio: number;

    @IsNumber()
    @IsNotEmpty()
    priorityRatio: number;
}
