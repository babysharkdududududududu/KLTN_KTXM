import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './entities/notification.entity';
import aqp from 'api-query-params';

import { SocketGateway } from '@/socketgateway/socket.gateway';

@Injectable()
export class NotificationService {

  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,

    private socketGateway: SocketGateway,
  ) { }

  async create(createNotificationDto: CreateNotificationDto) {
    const { title, message, type } = createNotificationDto;
    const notification = await this.notificationModel.create({
      title, message, type
    });
    this.socketGateway.sendNotification(notification);
    return {
      _id: notification._id
    };
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query); // Parse the query string into filter and sort options
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.notificationModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const skip = (current - 1) * (pageSize);

    const results = await this.notificationModel
      .find(filter)
      .skip(skip)
      .sort(sort as any);

    return {
      meta: {
        current: current, //trang hiện tại
        pageSize: pageSize, //số lượng bản ghi đã lấy
        pages: totalPages,  //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      results //kết quả query
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  async remove(id: string) {
    const result = await this.notificationModel.findByIdAndDelete(id);
    if (!result) {
      return {
        statusCode: 404,
        message: "Notification not found",
      };
    }
    return {
      statusCode: 200,
      message: "Notification successfully deleted",
      data: result,
    };
  }


}
