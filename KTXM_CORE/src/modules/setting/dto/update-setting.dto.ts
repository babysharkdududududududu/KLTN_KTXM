import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

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

    @IsString()
    @IsNotEmpty()
    registrationStartDate: string;

    @IsString()
    @IsNotEmpty()
    registrationEndDate: string;
}
