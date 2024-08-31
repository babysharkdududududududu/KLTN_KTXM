import { IsNumber, IsNotEmpty } from 'class-validator';

export class UpdateSettingDto {
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
