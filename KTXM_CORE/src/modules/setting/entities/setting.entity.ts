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

  // Trạng thái mặc định là 'closed'
  @Prop({ default: 'closed' }) // Các trạng thái: 'open', 'paused', 'stopped', 'closed'
  registrationStatus: string;

  @Prop({ default: false })
  openPayment: boolean;

  // thời gian hết hạn thanh toán
  @Prop({ type: Date })
  paymentDeadline: Date;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
