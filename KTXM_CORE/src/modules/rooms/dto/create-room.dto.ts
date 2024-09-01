import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class Equipment {
    @IsNotEmpty({ message: 'name không được để trống' })
    name: string;

    @IsNotEmpty({ message: 'quantity không được để trống' })
    quantity: number;
}

export class CreateRoomDto {
    @IsNotEmpty({ message: 'roomNumber không được để trống' })
    roomNumber: string;

    @IsOptional()
    description: string;

    @IsNotEmpty({ message: 'floor không được để trống' })
    floor: number;

    @IsOptional()
    type: string;

    @IsNotEmpty({ message: 'block không được để trống' })
    block: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Equipment)
    equipment: Equipment[];

    availableSpot?: number;
}
