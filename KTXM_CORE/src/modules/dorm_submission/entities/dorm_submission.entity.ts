import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type DormSubmissionDocument = HydratedDocument<DormSubmission>;
@Schema({ timestamps: true })
export class DormSubmission {
    @Prop()
    userId: string;

    @Prop()
    status: string;

    @Prop()
    note: string;

    @Prop()
    settingId: string;
}

export const DormSubmissionSchema = SchemaFactory.createForClass(DormSubmission);
