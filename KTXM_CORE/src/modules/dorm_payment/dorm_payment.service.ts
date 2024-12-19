import { DormSubmission, DormSubmissionStatus } from './../dorm_submission/entities/dorm_submission.entity';
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
    @InjectModel(DormSubmission.name)
    private readonly dormSubmissionRepository: Model<DormSubmission>,
  ) {
    this.payos = new PayOS(
      process.env.CLIENT_ID_PAYOS,
      process.env.API_ID_PAYOS,
      process.env.CHECKSUM_KEY_PAYOS
    );
  }
  async create(createDormPaymentDto: CreateDormPaymentDto) {
    const { userId, amount, roomNumber, paymentDate, submissionId } = createDormPaymentDto;
    if (!amount || !roomNumber || !paymentDate || !submissionId) {
      throw new Error('Missing required fields: amount, roomNumber, or paymentDate, or submissionId');
    }
    const orderCode = Number(userId.toString() + Math.floor(Math.random() * 10000).toString());
    const body = {
      orderCode,
      submissionId,
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
        submissionId: body.submissionId,
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
          submissionId: paymentLinkRes.submissionId,
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

  async handlePaymentCallback(orderCode: string, submissionId: string) {
    const dormBill = await this.dormPaymentRepository.findOne({ orderCode });
    const submission = await this.dormSubmissionRepository.findOne({ _id: submissionId });
    console.log('Handling payment callback for orderCode:', orderCode);
    console.log('Dorm bill:', submission);
    console.log('Dorm bill:', dormBill);
    console.log('Submission:', submission);

    if (!dormBill) {
      throw new Error('Dorm bill not found');
    }
    if (!submission) {
      throw new Error('Dorm submission not found');
    }

    dormBill.status = PaymentStatus.Paid;
    submission.status = DormSubmissionStatus.PAID;
    submission.statusHistory.push(DormSubmissionStatus.PAID);
    await dormBill.save();
    await submission.save();
  }
  async handleWebhook(body: any) {
    console.log('Handling webhook:', body);
    if (body && body.data && body.data.orderCode) {
      const orderCode = body.data.orderCode;
      const dormBill = await this.dormPaymentRepository.findOne({ orderCode });
      if (dormBill) {
        const submissionId = dormBill.submissionId;
        try {
          await this.handlePaymentCallback(orderCode, submissionId);
        } catch (error) {
          console.error('Error in handling webhook:', error.message);
        }
      } else {
        console.error('Dorm bill not found for orderCode:', orderCode);
      }
    } else {
      console.error('Invalid webhook data:', body);
    }
  }


  async getAllPayments(): Promise<{ paid: DormPayment[], unpaid: DormPayment[], count: { paid: number, unpaid: number } }> {
    try {
      const payments = await this.dormPaymentRepository.find().exec();
      if (!payments || payments.length === 0) {
        throw new Error('No payments found');
      }
      const paid = payments.filter((payment) => payment.status === 'Đã thanh toán');
      const unpaid = payments.filter((payment) => payment.status === 'Chưa thanh toán');
      const count = {
        paid: paid.length,
        unpaid: unpaid.length,
      };
      console.log('Number of paid:', count.paid);
      console.log('Number of unpaid:', count.unpaid);
      return { paid, unpaid, count };
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
