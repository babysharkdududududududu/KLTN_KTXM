import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DormSubmissionDocument = HydratedDocument<DormSubmission>;

export enum DormSubmissionStatus {
    PENDING = 'PENDING', // Chờ xử lý
    ACCEPTED = 'ACCEPTED', // Chấp nhận đơn đăng ký
    AWAITING_PAYMENT = 'AWAITING_PAYMENT', // Chờ thanh toán
    PAID = 'PAID', // Đã thanh toán
    ASSIGNED = 'ASSIGNED', // Đã xếp phòng
    REJECTED = 'REJECTED', // Từ chối đơn đăng ký
}

@Schema({ timestamps: true })
export class DormSubmission {
    @Prop()
    userId: string;

    @Prop({ enum: DormSubmissionStatus }) // Sử dụng enum cho status
    status: DormSubmissionStatus;

    @Prop()
    note: string;

    @Prop()
    settingId: string;

    @Prop()
    roomNumber: string;
}

export const DormSubmissionSchema = SchemaFactory.createForClass(DormSubmission);
