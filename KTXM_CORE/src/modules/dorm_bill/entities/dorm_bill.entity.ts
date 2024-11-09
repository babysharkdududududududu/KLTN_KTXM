import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type DormBillDocument = HydratedDocument<DormBill>;

export enum BillType {
    ELECTRIC = 'ELECTRIC',
    WATER = 'WATER',
}

export enum PaymentStatus {
    Unpaid = 'Unpaid',
    Paid = 'Paid',
    Cancelled = 'Cancelled',
}

@Schema({ timestamps: true })
export class DormBill {
    @Prop({ required: true })
    roomNumber: string;

    @Prop({ required: true })
    billType: BillType;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true, enum: PaymentStatus })
    status: PaymentStatus;

    @Prop({ required: true })
    orderCode: string;

    @Prop({ required: true })
    code: string;

    @Prop({ required: true })
    monthAndYear: string;

    @Prop({ required: true })
    previousReading: number; // Số trước

    @Prop({ required: true })
    currentReading: number; // Số sau

    @Prop()
    createDateTime: Date;

    @Prop()
    paymentDate: Date;

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

export const DormBillSchema = SchemaFactory.createForClass(DormBill);
