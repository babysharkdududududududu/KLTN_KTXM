import { Body, Injectable, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateDormPaymentDto } from './dto/create-dorm_payment.dto';
import { UpdateDormPaymentDto } from './dto/update-dorm_payment.dto';
import { Model } from 'mongoose';
import { DormPayment } from './entities/dorm_payment.entity';
import { InjectModel } from '@nestjs/mongoose';
const PayOS = require('@payos/node');
import { PaymentStatus } from './entities/dorm_payment.entity';


@Injectable()
export class DormPaymentService {
  private payos: any;

  constructor(
    @InjectModel(DormPayment.name)
    private readonly dormPaymentRepository: Model<DormPayment>,
  ) {
    this.payos = new PayOS(
      process.env.CLIENT_ID_PAYOS,
      process.env.API_ID_PAYOS,
      process.env.CHECKSUM_KEY_PAYOS
    );
  }
  async create(createDormPaymentDto: CreateDormPaymentDto) {
    const { userId, amount, roomNumber, paymentDate } = createDormPaymentDto;
    if (!amount || !roomNumber || !paymentDate) {
      throw new Error('Missing required fields: amount, roomNumber, or paymentDate');
    }
    const orderCode = Number(userId.toString() + Math.floor(Math.random() * 10000).toString());
    const body = {
      orderCode,
      amount: Number(amount),
      description: `Payment`,
      cancelUrl: 'https://www.google.com/',
      successUrl: 'https://www.google.com/',
      returnUrl: 'https://www.google.com/'
    };
    try {
      const paymentLinkRes = await this.payos.createPaymentLink(body);
      const dormPayment = new this.dormPaymentRepository({
        userId,
        amount,
        roomNumber,
        paymentDate,
        status: PaymentStatus.Unpaid,
        orderCode,
        description: body.description,
        cancelUrl: body.cancelUrl,
        successUrl: body.successUrl,
        returnUrl: body.returnUrl,
        checkoutUrl: paymentLinkRes.checkoutUrl,
      });
      await dormPayment.save();
      return {
        error: 0,
        message: 'Success',
        data: {
          bin: paymentLinkRes.bin,
          checkoutUrl: paymentLinkRes.checkoutUrl,
          accountNumber: paymentLinkRes.accountNumber,
          accountName: paymentLinkRes.accountName,
          amount: paymentLinkRes.amount,
          description: paymentLinkRes.description,
          orderCode: paymentLinkRes.orderCode,
          qrCode: paymentLinkRes.qrCode,
        },
      };
    } catch (error) {
      console.error('Error creating payment link or saving dormPayment:', error);
      return {
        error: -1,
        message: 'Fail',
        data: null,
      };
    }
  }

  async handlePaymentCallback(@Body() callbackData: any, @Res() res: Response) {
    const { orderCode, status } = callbackData;

    try {
      const dormPayment = await this.dormPaymentRepository.findOne({ orderCode });
      if (!dormPayment) {
        return res.status(404).json({ error: 'Payment not found' });
      }
      switch (status) {
        case 'SUCCESS':
          dormPayment.status = PaymentStatus.Paid;
          break;
        case 'CANCELED':
          dormPayment.status = PaymentStatus.Cancelled;
          break;
        default:
          dormPayment.status = PaymentStatus.Unpaid;
          break;
      }
      await dormPayment.save();

      return res.status(200).json({ message: 'Payment status updated successfully' });
    } catch (error) {
      console.error('Error handling payment callback:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }


  async getDormPaymentsByUserId(userId: string): Promise<DormPayment[]> {
    console.log('Fetching payments for userId:', userId); // Thêm log để kiểm tra
    try {
      const payments = await this.dormPaymentRepository.find({ userId }).exec();
      if (!payments || payments.length === 0) {
        throw new Error('No payments found for this user');
      }
      return payments;
    } catch (error) {
      console.error('Error fetching payments by userId:', error);
      throw new Error('Unable to retrieve payments for the user');
    }
  }



  findAll() {
    return `This action returns all dormPayment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dormPayment`;
  }

  update(id: number, updateDormPaymentDto: UpdateDormPaymentDto) {
    return `This action updates a #${id} dormPayment`;
  }

  remove(id: number) {
    return `This action removes a #${id} dormPayment`;
  }
}
