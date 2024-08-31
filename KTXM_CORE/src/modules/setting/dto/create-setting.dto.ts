import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateSettingDto {
    @IsNumber()
    @IsNotEmpty()
    firstYearSpots: number;

    @IsNumber()
    @IsNotEmpty()
    upperYearSpots: number;

    @IsNumber()
    @IsNotEmpty()
    prioritySpots: number;
}
