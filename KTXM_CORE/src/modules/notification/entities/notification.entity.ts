import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    message: string;

    @Prop({ default: Date.now })
    sentAt: Date;

    @Prop()
    type?: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
