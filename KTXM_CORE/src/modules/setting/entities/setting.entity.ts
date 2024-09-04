import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SettingDocument = HydratedDocument<Setting>;

@Schema({ timestamps: true })
export class Setting {
    @Prop({ default: 200 })
    totalAvailableSpots: number;

    @Prop({ default: 0 })
    firstYearSpots: number;

    @Prop({ default: 0 })
    upperYearSpots: number;

    @Prop({ default: 0 })
    prioritySpots: number;

    @Prop({ default: 0.5 })
    firstYearRatio: number;

    @Prop({ default: 0.45 })
    upperYearRatio: number;

    @Prop({ default: 0.05 })
    priorityRatio: number;

    @Prop({ type: Date, required: true })
    registrationStartDate: Date;

    @Prop({ type: Date, required: true })
    registrationEndDate: Date;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
