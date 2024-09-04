import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDate } from 'class-validator';
import { Document } from 'mongoose';

export type MaintenanceDocument = Document & Maintenance;

@Schema({ timestamps: true })
export class Maintenance {
    @Prop({ required: true, unique: true })
    maintenanceNumber: string;

    @Prop({ required: true })
    item: string;

    @Prop({ required: true, enum: [1, 2, 3, 4, 5, 6] })
    status: number;

    @Prop({ required: true })
    roomNumber: string;

    @Prop({ required: true })
    @IsDate()
    reportedAt: Date;

    @Prop({ type: [{ status: Number, updatedAt: Date }], default: [] })
    statusHistory: { status: number, updatedAt: Date }[];
}

export const MaintenanceSchema = SchemaFactory.createForClass(Maintenance);
