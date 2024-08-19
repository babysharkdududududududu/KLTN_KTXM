import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

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
}
