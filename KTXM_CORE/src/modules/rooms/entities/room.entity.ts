import { User } from '@/modules/users/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
// import { Equipment } from '@/modules/equipment/entities/equipment.entity';

export type RoomDocument = HydratedDocument<Room>;

export class Equipment {
    @Prop()
    name: string;

    @Prop()
    quantity: number;

    @Prop()
    status: number;
}

export enum Block {
    G = 'G',
    I = 'I',
}

@Schema({ timestamps: true })
export class Room {
    static find(arg0: { roomNumber: { $in: any[]; }; }) {
        throw new Error('Method not implemented.');
    }
    @Prop({ index: true })
    roomNumber: string;

    @Prop()
    description: string;

    @Prop()
    floor: number;

    // @Prop({ type: [Equipment] })
    // equipment: Equipment[];

    @Prop({ type: [Equipment] })
    equipment: Equipment[];

    @Prop()
    type: string;

    @Prop({ index: true })
    block: Block;

    @Prop({ default: 0 })
    capacity: number;

    @Prop({ default: 0 })
    availableSpot: number;

    @Prop({ default: false })
    occupied: boolean;

    @Prop({ default: 0 })
    price: number;

    @Prop({ default: 0 })
    waterNumber: number;

    @Prop({ default: 0 })
    electricityNumber: number;

    @Prop({ default: 0 })
    status: number;

    @Prop({ type: [{ type: User, ref: 'User' }] })
    users: User[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);