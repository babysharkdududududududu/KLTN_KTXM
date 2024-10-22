import { User } from '@/modules/users/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type StudentDisciplineDocument = HydratedDocument<StudentDiscipline>;

// Enum cho loại vi phạm
export enum ViolationType {
    TIMELINESS = 'Giờ giấc',
    HYGIENE = 'Vệ sinh',
}

// Enum cho hình thức xử lý
export enum PenaltyType {
    WARNING = 'Cảnh cáo',
    REVIEW_FORM = 'Bảng kiểm điểm',
}

@Schema({ timestamps: true })
export class StudentDiscipline {
    @Prop({ type: String, required: true })
    student: User;



    @Prop()
    violationDate: Date;

    @Prop({ type: String, enum: PenaltyType })
    penalty: PenaltyType;

    @Prop({ default: 1 })
    violationCount: number;

    @Prop([{
        content: { type: String, required: true },
        violationDate: { type: Date, required: true },
        violationType: { type: String, enum: ViolationType, required: true },
    }])
    descriptions: { content: string, violationDate: Date }[];

    @Prop({ default: false })
    isReviewed: boolean;
}

export const StudentDisciplineSchema = SchemaFactory.createForClass(StudentDiscipline);

// Middleware để cập nhật trạng thái isReviewed nếu vi phạm > 3
StudentDisciplineSchema.pre('save', function (next) {
    if (this.violationCount > 3) {
        this.isReviewed = true;
    }
    next();
});
