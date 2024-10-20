import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum PaymentStatus {
    Unpaid = 'Chưa thanh toán',
    Paid = 'Đã thanh toán',
    Cancelled = 'Hủy đơn',
}

@Schema()
export class DormPayment extends Document {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true })
    roomNumber: string;

    @Prop({ required: true })
    paymentDate: Date;

    @Prop({ required: true, enum: PaymentStatus })
    status: PaymentStatus;

    // Thêm các trường để lưu thông tin tạo liên kết
    @Prop({ required: true })
    orderCode: number;

    @Prop()
    description: string;

    @Prop()
    cancelUrl: string;

    @Prop()
    successUrl: string;

    @Prop()
    returnUrl: string;

    @Prop()
    checkoutUrl: string;
}

export const DormPaymentSchema = SchemaFactory.createForClass(DormPayment);
