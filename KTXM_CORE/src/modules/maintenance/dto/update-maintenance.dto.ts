import { PartialType } from '@nestjs/mapped-types';
import { CreateMaintenanceDto } from './create-maintenance.dto';
import { IsNotEmpty, IsString, IsNumber, IsDate } from 'class-validator';


export class UpdateMaintenanceDto extends PartialType(CreateMaintenanceDto) {
    @IsString()
    maintenanceNumber?: string;

    @IsString()
    item?: string;

    @IsNumber()
    status?: number;

    @IsString()
    @IsNotEmpty()
    roomNumber?: string;

}
