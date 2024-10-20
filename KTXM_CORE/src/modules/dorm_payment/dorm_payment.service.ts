import { Injectable } from '@nestjs/common';
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
      returnUrl: 'https://www.google.com/',
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
        checkoutUrl: paymentLinkRes.checkoutUrl, // Lưu link thanh toán
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

  async getDormPaymentsByUserId(userId: string): Promise<DormPayment[]> {
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
