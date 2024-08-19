import { IsNotEmpty, IsOptional } from "class-validator";

export class UpdateRoomDto {
    @IsNotEmpty({ message: "_id không được để trống" })
    @IsNotEmpty({ message: "_id không hợp lệ" })
    _id: string;

    @IsOptional()
    description: string;

    @IsOptional()
    type: string;

    @IsOptional()
    equipment: {
        name: string;
        quantity: number;
    }[];

    @IsOptional()
    price : number;

    @IsOptional()
    waterNumber: number;

    @IsOptional()
    electricityNumber: number;
}
