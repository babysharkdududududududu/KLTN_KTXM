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
    ROOM_REQUESTED = 'ROOM_REQUESTED', // Yêu cầu phòng
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

    // Thêm mảng các trạng thái lịch sử của đơn đăng ký
    @Prop({ type: [String], enum: DormSubmissionStatus })
    statusHistory: DormSubmissionStatus[];

    @Prop()
    email: string;
}

export const DormSubmissionSchema = SchemaFactory.createForClass(DormSubmission);
