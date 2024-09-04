import { IsNumber, IsNotEmpty, IsDate, IsString } from 'class-validator';

export class UpdateSettingDto {
    @IsNumber()
    @IsNotEmpty()
    firstYearRatio: number;

    @IsNumber()
    @IsNotEmpty()
    upperYearRatio: number;

    @IsNumber()
    @IsNotEmpty()
    priorityRatio: number;


    @IsString()
    @IsNotEmpty()
    registrationStartDate: string;
    
    @IsString()
    @IsNotEmpty()
    registrationEndDate: string;
}
