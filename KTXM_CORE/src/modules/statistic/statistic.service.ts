import { RoomsService } from './../rooms/rooms.service';
import { Maintenance } from './../maintenance/entities/maintenance.entity';
import { Injectable } from '@nestjs/common';
import { CreateStatisticDto } from './dto/create-statistic.dto';
import { UpdateStatisticDto } from './dto/update-statistic.dto';
import { DormSubmissionService } from '../dorm_submission/dorm_submission.service';
import { MaintenanceService } from '../maintenance/maintenance.service';
import { InjectModel } from '@nestjs/mongoose';
import { Room } from '../rooms/entities/room.entity';
import { DormSubmission } from '../dorm_submission/entities/dorm_submission.entity';

@Injectable()
export class StatisticService {
  constructor(
    private readonly roomService: RoomsService,
    private readonly dormsubmission: DormSubmissionService,
    private readonly Maintenance: MaintenanceService
  ) { }

  async getAvailableRoom() {
    const roomList = await this.roomService.findAll();
    const totalAvailableSpots = roomList.results.reduce((total, room) => total + (room.availableSpot || 0), 0);
    const totalCapacity = roomList.results.reduce((total, room) => total + (room.capacity || 0), 0);
    const totalRoom = roomList.results.length;
    const totalRoomAvailable = roomList.results.filter(room => room.availableSpot > 0).length;
    // Tạo cấu trúc để lưu trữ thông tin theo từng tầng và từng block
    const roomsByBlockAndFloor = {};
    roomList.results.forEach(room => {
      const block = room.block;
      const floor = room.floor;
      // Khởi tạo block nếu chưa có
      if (!roomsByBlockAndFloor[block]) { roomsByBlockAndFloor[block] = {}; }
      // Khởi tạo floor nếu chưa có
      if (!roomsByBlockAndFloor[block][floor]) { roomsByBlockAndFloor[block][floor] = []; }
      // Thêm thông tin phòng vào đúng block và floor
      roomsByBlockAndFloor[block][floor].push({
        roomNumber: room.roomNumber,
        availableSpot: room.availableSpot,
        capacity: room.capacity,
      });
    });
    return { totalAvailableSpots, totalCapacity, totalRoom, totalRoomAvailable, roomsByBlockAndFloor };
  }


  async getDormSubmission() {
    const dormSubmission = await this.dormsubmission.findAll();
    const totalDormSubmission = dormSubmission.data.length;
    const totalByStatus = dormSubmission.totalByStatus;

    return {
      totalDormSubmission,
      totalByStatus
    };
  }

  async getMaintenance() {
    const maintenance = await this.Maintenance.findAll();
    return maintenance;
  }





}
