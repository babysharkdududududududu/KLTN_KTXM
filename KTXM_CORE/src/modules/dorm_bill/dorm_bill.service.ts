import { Injectable } from '@nestjs/common';
import { BillType, DormBill, PaymentStatus } from './entities/dorm_bill.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from '../rooms/entities/room.entity';
import { Cron } from '@nestjs/schedule';
import PayOS from '@payos/node';
const YOUR_DOMAIN = 'http://103.209.34.203:8080';


@Injectable()
export class DormBillService {
  private payos: any;
  constructor(
    @InjectModel(DormBill.name)
    private dormBillModel: Model<DormBill>,
    @InjectModel(Room.name)
    private roomModel: Model<Room>,
  ) {
    this.payos = new PayOS(
      process.env.CLIENT_ID_PAYOS,
      process.env.API_ID_PAYOS,
      process.env.CHECKSUM_KEY_PAYOS
    );
  }

  // // @Cron('59 23 28-31 * *', {
  // //   name: 'createMonthlyBills',
  // // })
  // async handleCreateMonthlyBills() {
  //   const rooms = await this.roomModel.find().populate('users'); // Lấy tất cả các phòng và thông tin người dùng
  //   const currentDate = new Date();
  //   const monthAndYear = `${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

  //   for (const room of rooms) {
  //     // Tìm hóa đơn tháng trước
  //     const previousBill = await this.dormBillModel.findOne({
  //       roomNumber: room.roomNumber,
  //       monthAndYear: `${currentDate.getMonth()}/${currentDate.getFullYear() - 1}`, // Tìm tháng trước
  //       billType: BillType.ELECTRIC, // Chỉ tìm hóa đơn điện
  //     });

  //     const previousReading = previousBill ? previousBill.currentReading : 0; // Nếu không có hóa đơn thì mặc định là 0
  //     const currentReading = room.electricityNumber;

  //     // Đếm số lượng người dùng trong phòng
  //     const userCount = room.users.length; // Số lượng người dùng

  //     // Tính số KWh miễn phí dựa trên số lượng người dùng
  //     const freeElectricityPerUser = 2; // 2 KWh miễn phí cho mỗi người dùng
  //     const totalFreeElectricity = freeElectricityPerUser * userCount;

  //     // Tạo hóa đơn cho nước
  //     await this.createBill(room, previousReading, currentReading, monthAndYear, BillType.WATER, totalFreeElectricity);

  //     // Tạo hóa đơn cho điện
  //     await this.createBill(room, previousReading, currentReading, monthAndYear, BillType.ELECTRIC, totalFreeElectricity);
  //   }
  // }

  @Cron('44 21 4 12 *', {
    name: 'createMonthlyBills',
  })  
  async handleCreateMonthlyBills() {
    // Lấy thông tin phòng G201
    const room = await this.roomModel.findOne({ roomNumber: 'G201' }).populate('users'); // Lấy thông tin phòng G201 và người dùng
  
    if (!room) {
      console.warn('Room G201 not found');
      return; // Nếu không tìm thấy phòng, không làm gì cả
    }
  
    const currentDate = new Date();
    const monthAndYear = `${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
  
    // Tìm hóa đơn tháng trước cho điện
    const previousElectricBill = await this.dormBillModel.findOne({
      roomNumber: room.roomNumber,
      monthAndYear: `${currentDate.getMonth()}/${currentDate.getFullYear() - 1}`,
      billType: BillType.ELECTRIC,
    });
  
    const previousElectricReading = previousElectricBill ? previousElectricBill.currentReading : 0;
    const currentElectricReading = room.electricityNumber;
  
    // Tìm hóa đơn tháng trước cho nước
    const previousWaterBill = await this.dormBillModel.findOne({
      roomNumber: room.roomNumber,
      monthAndYear: `${currentDate.getMonth()}/${currentDate.getFullYear() - 1}`,
      billType: BillType.WATER,
    });
  
    const previousWaterReading = previousWaterBill ? previousWaterBill.currentReading : 0;
    const currentWaterReading = room.waterNumber;
  
    // Đếm số lượng người dùng trong phòng
    const userCount = room.users.length;
  
    // Tính số KWh miễn phí dựa trên số lượng người dùng
    const freeElectricityPerUser = 2;
    const totalFreeElectricity = freeElectricityPerUser * userCount;
  
    // Tính số khối nước miễn phí dựa trên số lượng người dùng
    const freeWaterPerUser = 3;
    const totalFreeWater = freeWaterPerUser * userCount;
  
    // Tính toán lượng điện đã sử dụng
    const electricityUsed = currentElectricReading - previousElectricReading;
    const electricityRate = 3000; // Giả định giá tiền điện 3000 VNĐ/KWh
    const totalElectricity = Math.max(0, electricityUsed - totalFreeElectricity) * electricityRate;
  
    // Tính toán lượng nước đã sử dụng
    const waterUsed = currentWaterReading - previousWaterReading; // Lượng nước đã sử dụng
    const waterRate = 5000; // Giả định giá tiền nước 5000 VNĐ/khối
    const totalWater = Math.max(0, waterUsed - totalFreeWater) * waterRate;
  
    // Tạo hóa đơn cho điện
    await this.createBill(room, previousElectricReading, currentElectricReading, monthAndYear, BillType.ELECTRIC, totalElectricity);
  
    // Tạo hóa đơn cho nước
   // await this.createBill(room, previousWaterReading, currentWaterReading, monthAndYear, BillType.WATER, totalWater);
  }
  
  
  private async createBill(room: Room, previousReading: number, currentReading: number, monthAndYear: string, billType: BillType, amount: number) {
    const currentDate = new Date();
    const hours = String(currentDate.getHours()).padStart(2, '0'); // Giờ (00-23)
    const minutes = String(currentDate.getMinutes()).padStart(2, '0'); // Phút (00-59)
    const seconds = String(currentDate.getSeconds()).padStart(2, '0'); // Giây (00-59)
  
    // Tạo một số ngẫu nhiên từ 1000 đến 9999
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // Số ngẫu nhiên 4 chữ số
  
    // Tạo orderCode bằng cách kết hợp số ngẫu nhiên với giờ, phút, giây
    const orderCodeString = `${randomNumber}${hours}${minutes}${seconds}`; // Kết hợp tất cả
    const orderCode = Number(orderCodeString.slice(0, 10)); // Chỉ lấy 10 ký tự đầu tiên và chuyển thành số
  
    const code = `${room.roomNumber}${billType === BillType.WATER ? 'W' : 'E'}${monthAndYear.replace('/', '')}`;
  
    const status = PaymentStatus.Unpaid;
  
    // Tạo body cho yêu cầu thanh toán
    const roundedAmount = Math.round(amount); // Làm tròn số tiền

    const body = {
      orderCode,
      amount: roundedAmount,
      description: `${room.roomNumber}${billType === BillType.WATER ? 'W' : 'E'}${monthAndYear.replace('/', '')}`,
      cancelUrl: `${YOUR_DOMAIN}`,
      successUrl: `${YOUR_DOMAIN}`,
      returnUrl: `${YOUR_DOMAIN}`,
    };
    try {
      // Tạo liên kết thanh toán
      const paymentLinkRes = await this.payos.createPaymentLink(body);
  
      // Tạo hóa đơn chỉ khi tạo liên kết thanh toán thành công
      const createdDormBill = new this.dormBillModel({
        roomNumber: room.roomNumber,
        previousReading,
        currentReading,
        monthAndYear,
        orderCode,
        code,
        amount,
        billType,
        status,
        cancelUrl: body.cancelUrl,
        successUrl: body.successUrl,
        returnUrl: body.returnUrl,
        checkoutUrl: paymentLinkRes.checkoutUrl, // Lưu checkoutUrl
      });
  
      return createdDormBill.save(); // Lưu hóa đơn vào DB
    } catch (error) {
      console.error('Error creating payment link:', error);
      throw new Error('Failed to create payment link');
    }
  }
  

  // api change status to paid
  async changeStatusToPaid(orderCode: string) {
    const dormBill = await this.dormBillModel.findOne({ orderCode });
    if (!dormBill) {
      throw new Error('Dorm bill not found');
    }
    dormBill.status = PaymentStatus.Paid;
    return dormBill.save();
  }

  // webhook-url for payos
  async handleWebhook(body: any) {
    console.log('Webhook body:', body);

    // Kiểm tra nếu có dữ liệu trong body
    if (body && body.data && body.data.orderCode) {
      const orderCode = body.data.orderCode;

      // Gọi phương thức để cập nhật trạng thái thành 'Paid'
      try {
        await this.changeStatusToPaid(orderCode);
      } catch (error) {
        console.error(`Error updating status for orderCode ${orderCode}:`, error.message);
      }
    } else {
      console.warn('Invalid webhook body: Missing orderCode');
    }
  }

  // find all bill by room number
  async findAllByRoomNumber(roomNumber: string) {
    return this.dormBillModel.find({ roomNumber }).exec();
  }

  async findAll({ roomNumber, monthAndYear, status, billType, season }: { roomNumber?: string, monthAndYear?: string, status?: PaymentStatus, billType?: BillType, season?: string }) {
    const query: any = {};

    // Xử lý điều kiện cho season
    if (season) {
      let monthsToSearch: string[] = [];

      // Trích xuất năm từ season
      const year = parseInt(season.substring(1), 10); // Lấy năm từ season (ví dụ: từ 'W2024' lấy 2024)
      console.log('Year:', year);
      if (season.startsWith('W')) {
        // Mùa đông (W2024): tháng 8 năm trước đến tháng 5 năm sau
        const EndYear = year + 1; // năm trước
        monthsToSearch = [
          `08/${year}`, // Tháng 8 năm trước
          `09/${year}`,
          `10/${year}`,
          `11/${year}`,
          `12/${year}`,
          `01/${EndYear}`, // Tháng 1 năm hiện tại
          `02/${EndYear}`,
          `03/${EndYear}`,
          `04/${EndYear}`,
          `05/${EndYear}`
        ];
      } else if (season.startsWith('S')) {
        // Mùa hè (S2024): tháng 6 đến tháng 7 năm hiện tại
        monthsToSearch = [
          `06/${year}`,
          `07/${year}`
        ];
      }

      // Nếu monthAndYear không được cung cấp, tìm hóa đơn theo monthsToSearch
      if (!monthAndYear) {
        query.monthAndYear = { $in: monthsToSearch }; // Tìm hóa đơn trong danh sách tháng
      } else {
        // Nếu monthAndYear được cung cấp, kiểm tra xem nó có trong danh sách không
        if (!monthsToSearch.includes(monthAndYear)) {
          return []; // Không có hóa đơn nào thỏa mãn
        }
        query.monthAndYear = monthAndYear; // Thỏa mãn điều kiện
      }
    }

    if (roomNumber) {
      query.roomNumber = roomNumber;
    }
    if (status) {
      query.status = status;
    }
    if (billType) {
      query.billType = billType;
    }

    return this.dormBillModel.find(query);
  }


  findOne(id: number) {
    return `This action returns a #${id} dormBill`;
  }

  remove(id: number) {
    return `This action removes a #${id} dormBill`;
  }
}
