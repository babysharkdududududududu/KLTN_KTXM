import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BillType, PaymentStatus } from '../entities/dorm_bill.entity';
export class CreateDormBillDto {
    @IsString()
    roomNumber: string;

    @IsEnum(BillType)
    billType: BillType;

    @IsNumber()
    amount: number;

    @IsEnum(PaymentStatus)
    status: PaymentStatus;

    @IsNumber()
    orderCode: number;

    @IsString()
    code: string;
    
    @IsString()
    monthAndYear: string;

    @IsNumber()
    previousReading: number; // Số trước

    @IsNumber()
    currentReading: number; // Số sau

    createDateTime?: Date; // Có thể không cần thiết, để mongoose tự động tạo
    paymentDate?: Date; // Có thể không cần thiết, để mongoose tự động tạo
}
