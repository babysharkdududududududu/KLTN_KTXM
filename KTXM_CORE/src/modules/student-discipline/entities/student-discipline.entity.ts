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
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    student: User;

    @Prop({ type: String, enum: ViolationType })
    violationType: ViolationType;

    @Prop()
    violationDate: Date;

    @Prop({ type: String, enum: PenaltyType })
    penalty: PenaltyType;

    @Prop({ default: 1 })
    violationCount: number;

    @Prop()
    description: string;

    @Prop({ default: false })
    isReviewed: boolean;
}

export const StudentDisciplineSchema = SchemaFactory.createForClass(StudentDiscipline);

StudentDisciplineSchema.pre('save', function (next) {
    if (this.violationCount > 3) {
        this.isReviewed = true;
    }
    next();
});