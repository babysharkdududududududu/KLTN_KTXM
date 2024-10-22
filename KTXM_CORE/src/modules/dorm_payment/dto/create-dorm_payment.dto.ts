import { IsNotEmpty } from "class-validator";

export class CreateDormPaymentDto {
    @IsNotEmpty({ message: "userId không được để trống" })
    userId: string;
    @IsNotEmpty({ message: "amount không được để trống" })
    amount: number;
    @IsNotEmpty({ message: "roomNumber không được để trống" })
    roomNumber: string;
    @IsNotEmpty({ message: "paymentDate không được để trống" })
    paymentDate: Date;
}
