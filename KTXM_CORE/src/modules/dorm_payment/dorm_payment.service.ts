import { Body, Get, Injectable, Post, Query, Render, Res } from '@nestjs/common';
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
      cancelUrl: `${process.env.BASE_URL}/dorm-payment/success?orderCode=${orderCode}&status=cancelled`,
      successUrl: `${process.env.BASE_URL}/dorm-payment/success?orderCode=${orderCode}&status=success`,
      returnUrl: `${process.env.BASE_URL}/dorm-payment/success?orderCode=${orderCode}&status=return`
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

  // @Post('callback')
  // async handlePaymentCallback(@Body() callbackData: any, @Res() res: Response) {
  //   const { orderCode, status } = callbackData;

  //   try {
  //     const dormPayment = await this.dormPaymentRepository.findOne({ orderCode });
  //     if (!dormPayment) {
  //       return res.status(404).json({ error: 'Payment not found' });
  //     }

  //     switch (status) {
  //       case 'SUCCESS':
  //       case 'PAID':  // Xử lý thêm trạng thái PAID
  //         dormPayment.status = PaymentStatus.Paid;
  //         break;
  //       case 'CANCELED':
  //         dormPayment.status = PaymentStatus.Cancelled;
  //         break;
  //       default:
  //         dormPayment.status = PaymentStatus.Unpaid;
  //         break;
  //     }
  //     await dormPayment.save();

  //     return res.redirect(`/dorm-payment/success?orderCode=${orderCode}&status=success`);
  //   } catch (error) {
  //     console.error('Error handling payment callback:', error);
  //     return res.redirect('/dorm-payment/result?status=fail');
  //   }
  // }
  async handlePaymentCallback(callbackData: any) {
    const { orderCode, status } = callbackData;

    try {
      const dormPayment = await this.dormPaymentRepository.findOne({ orderCode });
      if (!dormPayment) {
        throw new Error('Payment not found'); // Sử dụng throw để xử lý trong callback
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

      return {
        orderCode: dormPayment.orderCode,
        status: dormPayment.status,
      };
    } catch (error) {
      console.error('Error handling payment callback:', error);
      throw new Error('Internal server error'); // Ném ra lỗi để xử lý ở callback
    }
  }




  // @Post('callback')
  // async handlePaymentCallback(@Body() callbackData: any, @Res() res: Response) {
  //   const { orderCode, status } = callbackData;

  //   try {
  //     const dormPayment = await this.dormPaymentRepository.findOne({ orderCode });
  //     if (!dormPayment) {
  //       return res.status(404).json({ error: 'Payment not found' });
  //     }

  //     switch (status) {
  //       case 'SUCCESS':
  //         dormPayment.status = PaymentStatus.Paid;
  //         break;
  //       case 'CANCELED':
  //         dormPayment.status = PaymentStatus.Cancelled;
  //         break;
  //       default:
  //         dormPayment.status = PaymentStatus.Unpaid;
  //         break;
  //     }

  //     await dormPayment.save();

  //     // Chuyển hướng tới trang thông báo thành công
  //     return res.redirect(`/dorm-payment/result?status=${status.toLowerCase()}`);
  //   } catch (error) {
  //     console.error('Error handling payment callback:', error);
  //     return res.redirect('/dorm-payment/result?status=fail');
  //   }
  // }



  // @Get('result')
  // @Render('payment-result')
  // async getPaymentResult(@Query('status') status: string) {
  //   let message;
  //   if (status === 'success') {
  //     message = 'Thanh toán thành công!';
  //   } else if (status === 'fail') {
  //     message = 'Thanh toán thất bại hoặc đã bị hủy.';
  //   } else {
  //     message = 'Không rõ trạng thái thanh toán.';
  //   }

  //   return { status, message };
  // }

  async confirmWebhook(body: { webhookUrl: string }) {
    const { webhookUrl } = body;
    try {
      await this.payos.confirmWebhook(webhookUrl);
      return {
        error: 0,
        message: 'ok',
        data: null,
      };
    } catch (error) {
      console.error(error);
      return {
        error: -1,
        message: 'failed',
        data: null,
      };
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
