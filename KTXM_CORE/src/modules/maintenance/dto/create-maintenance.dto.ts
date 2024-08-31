import { IsNotEmpty, IsString, IsNumber, IsDate } from 'class-validator';

export class CreateMaintenanceDto {
    @IsNotEmpty()
    @IsString()
    maintenanceNumber: string;

    @IsNotEmpty()
    @IsString()
    item: string;

    @IsNotEmpty()
    @IsNumber()
    status: number;

    @IsNotEmpty()
    @IsString()
    roomNumber: string;
}

