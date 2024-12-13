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
import { DormPaymentService } from '../dorm_payment/dorm_payment.service';

@Injectable()
export class StatisticService {
  constructor(
    private readonly roomService: RoomsService,
    private readonly dormsubmission: DormSubmissionService,
    private readonly Maintenance: MaintenanceService,
    private readonly payment: DormPaymentService,
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
    const settingIds = dormSubmission.settingIds; // Đây là mảng settingIds
    const nameSettingArray = dormSubmission.nameSetting; // Đây là mảng nameSettingArray

    // Chuyển đổi mảng nameSetting thành đối tượng nameSetting
    const nameSetting = {};


    settingIds.forEach((id, index) => {
      if (index < Number(nameSettingArray.length)) {
        nameSetting[id] = nameSettingArray[index];
      }
    });

    const submissionBySetting: { [key: string]: any[] } = {};
    dormSubmission.data.forEach(submission => {
      const settingId = submission.settingId;
      if (!submissionBySetting[settingId]) {
        submissionBySetting[settingId] = [];
      }
      submissionBySetting[settingId].push(submission);
    });

    const submissionCountsByStatus: { [key: string]: any } = {};

    for (const settingId in submissionBySetting) {
      const displayName = nameSetting[settingId];
      if (!displayName) {
        console.warn(`Không tìm thấy tên cho settingId: ${settingId}`);
        continue;
      }
      if (!submissionCountsByStatus[displayName]) {
        submissionCountsByStatus[displayName] = {};
      }
      submissionBySetting[settingId].forEach(submission => {
        const status = submission.status;
        if (!submissionCountsByStatus[displayName][status]) {
          submissionCountsByStatus[displayName][status] = 0;
        }
        submissionCountsByStatus[displayName][status]++;
      });
    }

    console.log(submissionCountsByStatus);

    return {
      totalDormSubmission,
      totalByStatus,
      settingIds,
      nameSetting,
      submissionBySetting,
      submissionCountsByStatus
    };
  }

  async getMaintenance() {
    const maintenance = await this.Maintenance.findAll();
    // Thống kê số lượng bảo trì theo năm tháng
    const maintenanceByYearMonth = {};
    maintenance.forEach(maintenanceRecord => {
      const yearMonth = maintenanceRecord.reportedAt.toISOString().substring(0, 7);  // Extract year-month (e.g., "2024-09")
      if (!maintenanceByYearMonth[yearMonth]) {
        maintenanceByYearMonth[yearMonth] = [];
      }
      maintenanceByYearMonth[yearMonth].push(maintenanceRecord);
    });

    // Thống kê theo năm và tháng
    const maintenanceCountsByYearr = {};

    // Duyệt qua tất cả year-month để tách theo từng năm
    for (const yearMonth in maintenanceByYearMonth) {
      const [year, month] = yearMonth.split('-'); // Tách năm và tháng từ year-month
      if (!maintenanceCountsByYearr[year]) {
        maintenanceCountsByYearr[year] = {}; // Tạo một đối tượng cho năm nếu chưa có
      }
      if (!maintenanceCountsByYearr[year][month]) {
        maintenanceCountsByYearr[year][month] = 0; // Khởi tạo tháng với giá trị 0 nếu chưa có
      }
      // Tăng số lượng bảo trì cho năm và tháng tương ứng
      maintenanceCountsByYearr[year][month] += maintenanceByYearMonth[yearMonth].length;
    }
    // thống kê số lượng bảo trì theo năm
    const maintenanceByYear = {};
    maintenance.forEach(maintenanceRecord => {
      const year = maintenanceRecord.reportedAt.toISOString().substring(0, 4);
      if (!maintenanceByYear[year]) {
        maintenanceByYear[year] = [];
      }
      maintenanceByYear[year].push(maintenanceRecord);
    });
    const maintenanceCountsByYear = {};
    for (const year in maintenanceByYear) {
      maintenanceCountsByYear[year] = maintenanceByYear[year].length;
    }
    // thống kê số lượng bảo trì theo năm và phòng
    const maintenanceByYearRoom = {};
    maintenance.forEach(maintenanceRecord => {
      const year = maintenanceRecord.reportedAt.toISOString().substring(0, 4);
      const room = maintenanceRecord.roomNumber;
      if (!maintenanceByYearRoom[year]) {
        maintenanceByYearRoom[year] = {};
      }
      if (!maintenanceByYearRoom[year][room]) {
        maintenanceByYearRoom[year][room] = [];
      }
      maintenanceByYearRoom[year][room].push(maintenanceRecord);
    });
    const maintenanceCountsByYearRoom = {};
    for (const year in maintenanceByYearRoom) {
      maintenanceCountsByYearRoom[year] = {};
      for (const room in maintenanceByYearRoom[year]) {
        maintenanceCountsByYearRoom[year][room] = maintenanceByYearRoom[year][room].length;
      }
    }

    return {
      // maintenanceByYearMonth,
      maintenanceCountsByYearr,
      // maintenanceByYear,
      maintenanceCountsByYear,
      // maintenanceByYearRoom,
      maintenanceCountsByYearRoom
    }
  }

  async getPayment() {
    const payment = await this.payment.getAllPayments();
    return payment;
  }

  async getEquipment() {
    const equipment = await this.Maintenance.findAll();
    const equipmentByYear = {};
    equipment.forEach(equipmentRecord => {
      const year = equipmentRecord.reportedAt.toISOString().substring(0, 4);
      if (!equipmentByYear[year]) {
        equipmentByYear[year] = [];
      }
      equipmentByYear[year].push(equipmentRecord);
    });
    const equipmentCountsByYear = {};
    for (const year in equipmentByYear) {
      equipmentCountsByYear[year] = equipmentByYear[year].length;
    }
    return {
      equipmentCountsByYear
    }
  }









}
