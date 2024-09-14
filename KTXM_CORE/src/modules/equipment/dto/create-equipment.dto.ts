import { IsNotEmpty } from "class-validator";

export class CreateEquipmentDto {

    @IsNotEmpty({ message: 'equipNumber không được để trống' })
    equipNumber: string;

    @IsNotEmpty({ message: 'name không được để trống' })
    name: string;

    @IsNotEmpty({ message: 'status không được để trống' })
    status: number;

    @IsNotEmpty({ message: 'startDate không được để trống' })
    startDate: Date;

    @IsNotEmpty({ message: 'roomNumber không được để trống ' })
    roomNumber: string;

}
