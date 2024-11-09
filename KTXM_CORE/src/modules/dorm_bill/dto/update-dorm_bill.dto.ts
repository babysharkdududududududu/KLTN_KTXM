import { PartialType } from '@nestjs/mapped-types';
import { CreateDormBillDto } from './create-dorm_bill.dto';

export class UpdateDormBillDto extends PartialType(CreateDormBillDto) {}
