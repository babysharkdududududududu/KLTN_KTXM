import { IsNumber, IsNotEmpty, IsDate, IsString } from 'class-validator';

export class CreateSettingDto {
    
    @IsString()
    @IsNotEmpty()
    name: string;

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
