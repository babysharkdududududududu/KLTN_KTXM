import { Body, Get, Injectable, Post, Query, Render, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateDormPaymentDto } from './dto/create-dorm_payment.dto';
import { UpdateDormPaymentDto } from './dto/update-dorm_payment.dto';
import { Model } from 'mongoose';
import { DormPayment } from './entities/dorm_payment.entity';
import { InjectModel } from '@nestjs/mongoose';
const PayOS = require('@payos/node');
import { PaymentStatus } from './entities/dorm_payment.entity';
const YOUR_DOMAIN = 'http://localhost:3000';
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
      // cancelUrl: `${process.env.BASE_URL}/dorm-payment/success?orderCode=${orderCode}&status=cancelled`,
      // successUrl: `${process.env.BASE_URL}/dorm-payment/success?orderCode=${orderCode}&status=success`,
      // returnUrl: `${process.env.BASE_URL}/dorm-payment/success?orderCode=${orderCode}&status=return`
      cancelUrl: `${YOUR_DOMAIN}`,
      successUrl: `${YOUR_DOMAIN}`,
      returnUrl: `${YOUR_DOMAIN}`,
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

  async handlePaymentCallback(orderCode: string) {
    const dormBill = await this.dormPaymentRepository.findOne({ orderCode });
    if (!dormBill) {
      throw new Error('Dorm bill not found');
    }
    dormBill.status = PaymentStatus.Paid;
    return dormBill.save();
  }

  async confirmWebhook(body: { webhookUrl: string }) {
    console.log('Confirming webhook with URL:', body.webhookUrl); // Log URL để kiểm tra
    try {
      await this.payos.confirmWebhook(body.webhookUrl);
      return {
        error: 0,
        message: 'ok',
        data: null,
      };
    } catch (error) {
      console.error('Error in confirming webhook:', error); // Log lỗi chi tiết
      return {
        error: -1,
        message: 'failed',
        data: null,
      };
    }
  }

  async handleWebhook(body: any) {
    console.log('Handling webhook:', body);
    if (body && body.data && body.data.orderCode) {
      const orderCode = body.data.orderCode;
      console.log('Handling webhook for orderCode:', orderCode);
      try {
        await this.handlePaymentCallback(orderCode);
      } catch (error) {
        console.error('Error in handling webhook:', error.message);
      }
    }
    else {
      console.error('Invalid webhook data:', body);
    }
  }
  // async confirmWebhook(body: any) {
  //   console.log('Handling and confirming webhook:', body);

  //   if (body && body.data && body.data.orderCode) {
  //     const orderCode = body.data.orderCode;
  //     console.log('Handling webhook for orderCode:', orderCode);

  //     try {
  //       // Xử lý thông tin thanh toán từ callback
  //       await this.handlePaymentCallback(orderCode);

  //       // Sau khi xử lý thanh toán, xác nhận webhook
  //       if (body.webhookUrl) {
  //         console.log('Confirming webhook with URL:', body.webhookUrl);
  //         await this.payos.confirmWebhook(body.webhookUrl);
  //       } else {
  //         console.error('Webhook URL is missing');
  //       }

  //       return {
  //         error: 0,
  //         message: 'Webhook handled and confirmed successfully',
  //         data: null,
  //       };
  //     } catch (error) {
  //       console.error('Error in handling and confirming webhook:', error);
  //       return {
  //         error: -1,
  //         message: 'Failed to handle and confirm webhook',
  //         data: null,
  //       };
  //     }
  //   } else {
  //     console.error('Invalid webhook data:', body);
  //     return {
  //       error: -1,
  //       message: 'Invalid webhook data',
  //       data: null,
  //     };
  //   }
  // }
  async getAllPayments(): Promise<{ paid: DormPayment[], unpaid: DormPayment[] }> {
    try {
      const payments = await this.dormPaymentRepository.find().exec();
      if (!payments || payments.length === 0) { throw new Error('No payments found'); }
      const paid = payments.filter((payment) => payment.status === 'Đã thanh toán');
      const unpaid = payments.filter((payment) => payment.status === 'Chưa thanh toán');
      return { paid, unpaid };
    } catch (error) {
      console.error('Error fetching all payments:', error);
      throw new Error('Unable to retrieve all payments');
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

  async getAllPayment(): Promise<DormPayment[]> {
    return this.dormPaymentRepository.find().exec();
  }
}
