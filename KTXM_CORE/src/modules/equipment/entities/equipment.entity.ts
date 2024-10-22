import { Room } from '@/modules/rooms/entities/room.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument, Types } from 'mongoose';

export type EquipmentDocument = HydratedDocument<Equipment>;

@Schema({ timestamps: true })
export class Equipment extends Document {
    @Prop({ required: true })
    equipNumber: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    status: number;

    @Prop({ required: true })
    startDate: Date;

    @Prop()
    endDate: Date;

    @Prop()
    fixedDate: Date;

    @Prop()
    location: string[];

    @Prop({ required: true })
    roomNumber: string;

    @Prop({ default: 0 })
    repairNumber: number;

    @Prop({ type: [Date] })
    repairHistory: Date[];
}

export const EquipmentSchema = SchemaFactory.createForClass(Equipment);
