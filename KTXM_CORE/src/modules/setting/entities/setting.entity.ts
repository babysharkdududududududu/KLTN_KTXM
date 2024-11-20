import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SettingDocument = HydratedDocument<Setting>;

@Schema({ timestamps: true })
export class Setting {

    @Prop()
    name: string;

    @Prop({ default: 0 })               
    totalAvailableSpots: number;

    @Prop({ default: 0 })
    firstYearSpots: number;

    @Prop({ default: 0 })
    firstYearSubmissions: number;

    @Prop({ default: 0 })
    upperYearSpots: number;

    @Prop({ default: 0 })
    upperYearSubmissions: number;

    @Prop({ default: 0 })
    prioritySpots: number;

    @Prop({ default: 0 })
    prioritySubmissions: number;

    @Prop({ type: Date, required: true })
    registrationStartDate: Date;

    @Prop({ type: Date, required: true })
    registrationEndDate: Date;

    @Prop({ default: false })
    isRegistrationOpen: boolean;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
