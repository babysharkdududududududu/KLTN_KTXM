import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoomDocument = HydratedDocument<Room>;

export class Equipment {
    @Prop()
    name: string;

    @Prop()
    quantity: number;
}

@Schema({ timestamps: true })
export class Room {
    @Prop({ index: true })
    roomNumber: string;

    @Prop()
    description: string;

    @Prop()
    floor: number;

    @Prop()
    capacity: number;

    @Prop()
    availableSpot: number;

    @Prop()
    occupied: boolean;

    @Prop()
    price: number;

    @Prop({ type: [Equipment] })
    equipment: Equipment[];

    @Prop()
    type: string;

    @Prop()
    gender: string;

    @Prop({ index: true })
    block: string;

    @Prop()
    waterNumber: number;

    @Prop()
    electricityNumber: number;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
