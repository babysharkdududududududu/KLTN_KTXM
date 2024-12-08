import { Module } from '@nestjs/common';
import { DormPaymentService } from './dorm_payment.service';
import { DormPaymentController } from './dorm_payment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DormPayment, DormPaymentSchema } from './entities/dorm_payment.entity'; // Đảm bảo đường dẫn này đúng
import { DormSubmission, DormSubmissionSchema } from '../dorm_submission/entities/dorm_submission.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DormPayment.name, schema: DormPaymentSchema }, { name: DormSubmission.name, schema: DormSubmissionSchema }]),
  ],
  controllers: [DormPaymentController],
  providers: [DormPaymentService],
  exports: [DormPaymentService],
})
export class DormPaymentModule { }
