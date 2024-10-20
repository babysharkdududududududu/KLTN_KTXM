import { PartialType } from '@nestjs/mapped-types';
import { CreateDormPaymentDto } from './create-dorm_payment.dto';

export class UpdateDormPaymentDto extends PartialType(CreateDormPaymentDto) {}
