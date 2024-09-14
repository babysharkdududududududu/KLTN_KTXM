import { PartialType } from '@nestjs/mapped-types';
import { CreateEquipmentDto } from './create-equipment.dto';
import { IsString } from 'class-validator';

export class UpdateEquipmentDto extends PartialType(CreateEquipmentDto) {
    @IsString()
    roomNumber?: string;
}
