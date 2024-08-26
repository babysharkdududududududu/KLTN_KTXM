import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ContractDocument = HydratedDocument<Contract>;

@Schema({ timestamps: true })
export class Contract {
    @Prop({ index: true })
    contractNumber: string;
    
    @Prop()
    userId: string;

    @Prop()
    roomNumber: string;

    @Prop()
    startDate: Date;

    @Prop()
    endDate: Date;
}

export const ContractSchema = SchemaFactory.createForClass(Contract);
