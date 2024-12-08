import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model, mongo } from 'mongoose';
import { hashPasswordHelper } from '@/helpers/util';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { ChangePasswordAuthDto, CodeAuthDto, CreateAuthDto } from '@/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
import { StudentDiscipline } from '../student-discipline/entities/student-discipline.entity';
import { Room } from '../rooms/entities/room.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(Room.name)
    private roomModel: Model<Room>,
    @InjectModel(StudentDiscipline.name)
    private readonly studentDiscipline: Model<StudentDiscipline>,
    private readonly mailerService: MailerService
  ) { }

  // Kiểm tra email đã tồn tại chưa
  isEmailExist = async (email: string) => {
    const user = await this.userModel.exists({ email });
    if (user) return true;
    return false;
  }

  isUserIdExist = async (userId: string) => {
    const user = await this.userModel.exists({ userId });
    if (user) return true;
    return false;
  }

  async create(createUserDto: CreateUserDto) {
    const { name, email, userId, password, phone, address, image, role, gender } = createUserDto;

    //check email
    const isExist = await this.isEmailExist(email);
    if (isExist === true) {
      throw new BadRequestException(`Email đã tồn tại: ${email}. Vui lòng sử dụng email khác.`)
    }
    const isUserIdExist = await this.isUserIdExist(userId);
    if (isUserIdExist === true) {
      throw new BadRequestException(`Mã số sinh viên đã tồn tại: ${userId}. Vui lòng sử dụng mã số khác.`)
    }

    //hash password
    const hashPassword = await hashPasswordHelper(password);
    const user = await this.userModel.create({
      name, email, userId, password: hashPassword, phone, address, image, role, gender
    })
    return {
      _id: user._id
    }
  }

  async importUsers(usersData: any[]) {
    const users = usersData.map(async (user) => {
      // Kiểm tra các trường bắt buộc
      if (!user.name || !user.email || !user.userId || !user.password) {
        throw new Error(`Missing required fields for user: ${JSON.stringify(user)}`);
      }

      return {
        name: user.name,
        email: user.email,
        userId: user.userId,
        password: await hashPasswordHelper(user.password),
        phone: user.phone || '',
        address: user.address || '',
        image: user.image || '',
        role: user.role || 'USERS',
        accountType: user.accountType || 'LOCAL',
        isActive: user.isActive || false,
        codeId: user.codeId || '',
        codeExpired: user.codeExpired ? new Date(user.codeExpired) : null,
        dateOfBirth: user.dateOfBirth
          ? new Date(user.dateOfBirth)
          : null,
        gender: user.gender || '',
        class: user.class || '',
        faculty: user.faculty || '',
      };
    });

    try {
      const resolvedUsers = await Promise.all(users);
      return this.userModel.insertMany(resolvedUsers);
    } catch (error) {
      console.error('Error importing users:', error);
      throw error; // Ném lỗi lên trên để xử lý
    }
  }

  async checkExistingUsers(userIds: string[]) {
    const users = await this.userModel.find({ userId: { $in: userIds } });
    return users.map(user => user.userId); // Trả về danh sách userId đã tồn tại
  }

  async findAll() {
    const rs = await this.userModel.aggregate([
      {
        $lookup: {
          from: "studentdisciplines",
          localField: "userId",
          foreignField: "student",
          as: "disciplines"
        }
      }
    ]);

    console.log(rs, "-----------------");
    return rs;
  }



  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email })
  }

  async findByUserId(userId: string) {
    return await this.userModel.findOne({ userId })
  }

  // async update(updateUserDto: UpdateUserDto) {
  //   return await this.userModel.updateOne(
  //     { _id: updateUserDto._id }, { ...updateUserDto });
  // }
  // Cập nhật user trong Schema User và cả phòng mà user đó đang ở
  async update(updateUserDto: UpdateUserDto) {
    // Lọc các trường được phép cập nhật
    const allowedUpdates = {
      phone: updateUserDto.phone,
      address: updateUserDto.address,
      dateOfBirth: updateUserDto.dateOfBirth,
      email: updateUserDto.email,
    };
    console.log(allowedUpdates, "allowedUpdates");

    const fieldsToUpdate = Object.fromEntries(
      Object.entries(allowedUpdates).filter(([_, value]) => value !== undefined)
    );
    console.log(fieldsToUpdate, "fieldsToUpdate");

    // Bước 1: Cập nhật thông tin user
    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: updateUserDto._id },
      { $set: fieldsToUpdate }, // Cập nhật chỉ các trường cụ thể
      { new: true }             // Trả về bản ghi đã cập nhật
    );
    console.log(updatedUser, "updatedUser");

    if (!updatedUser) {
      throw new Error('User not found');
    }

    // Bước 2: Cập nhật user trong phòng mà user đó đang ở (nếu có)
    const room = await this.roomModel.findOne(
      { "users._id": updatedUser._id }
    );
    console.log(room, "room");

    if (room) {
      // Tìm chỉ số của người dùng trong mảng users
      const userIndex = room.users.findIndex((user: any) => user._id.equals(updatedUser._id));

      if (userIndex !== -1) {
        // Cập nhật thông tin người dùng trong phòng đó
        room.users[userIndex] = updatedUser; // Cập nhật thông tin người dùng
        await room.save(); // Lưu lại thay đổi
      }
    } else {
      // Không cần ném lỗi nếu không tìm thấy phòng
      console.log('User is not found in any room, but updated successfully');
    }

    return updatedUser;
  }







  async remove(_id: string) {
    //check id
    if (mongoose.isValidObjectId(_id)) {
      //delete
      return this.userModel.deleteOne({ _id })
    } else {
      throw new BadRequestException("Id không đúng định dạng mongodb")
    }
  }

  async handleRegister(registerDto: CreateAuthDto) {
    const { name, password, userId } = registerDto;

    const isUserIdExist = await this.isUserIdExist(userId);
    if (isUserIdExist === true) {
      throw new BadRequestException(`Mã số sinh viên đã tồn tại: ${userId}. Vui lòng sử dụng mã số khác.`)
    }

    //hash password
    const hashPassword = await hashPasswordHelper(password);
    const user = await this.userModel.create({
      name, password: hashPassword, userId,
      isActive: false,
    })
    return {
      _id: user._id
    }

  }

  async handleActive(data: CodeAuthDto) {
    const user = await this.userModel.findOne({
      _id: data._id,
      codeId: data.code
    })
    if (!user) {
      throw new BadRequestException("Mã code không hợp lệ hoặc đã hết hạn")
    }

    //check expire code
    const isBeforeCheck = dayjs().isBefore(user.codeExpired);

    if (isBeforeCheck) {
      //valid => update user
      await this.userModel.updateOne({ _id: data._id }, {
        isActive: true
      })
      return { isBeforeCheck };
    } else {
      throw new BadRequestException("Mã code không hợp lệ hoặc đã hết hạn")
    }
  }

  async retryActive(email: string) {
    //check email
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException("Tài khoản không tồn tại")
    }
    if (user.isActive) {
      throw new BadRequestException("Tài khoản đã được kích hoạt")
    }
    //send Email
    const codeId = uuidv4();
    //update user
    await user.updateOne({
      codeId: codeId,
      codeExpired: dayjs().add(5, 'minutes')
    })
    //send email
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      subject: 'Activate tài khoản của bạn ở KTXM', // Subject line
      template: "register",
      context: {
        name: user?.name ?? user.email,
        activationCode: codeId
      }
    })
    return { _id: user._id }
  }

  // send mail with approve room
  async sendMailApproveRoom(email: string) {
    //check email
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException("Không tìm thấy tài khoản")
    }
    //send email
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      subject: 'Duyệt phòng thành công', // Subject line
      template: "register",
      context: {
        name: user?.name ?? user.email,
      }
    })
    return { _id: user._id }
  }
  // send mail with reject room
  async sendMailRejectRoom(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException("Không tìm thấy tài khoản")
    }
    //send email
    this.mailerService.sendMail({
      to: user.email,
      subject: 'Từ chối đơn đăng ký phòng',
      template: "rejected",
      context: {
        name: user?.name ?? user.email,
      }
    })
    return { _id: user._id }
  }
  // send mail with approve room
  async sendMailAssigned(email: string, roomNumber: string) {
    //check email
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException("Không tìm thấy tài khoản")
    }
    //send email
    this.mailerService.sendMail({
      to: user.email,
      subject: 'Xếp phòng thành công', // Subject line
      template: "assigned",
      context: {
        name: user?.name ?? user.email,
        roomNumber: roomNumber,
        block: roomNumber.slice(0, 1),
        floor: roomNumber.slice(1, 2),
      }
    })
  }
  // send mail with awaitting room
  async sendMailAwaittingPayment(email: string) {
    console.log(email);
    try {
      // Kiểm tra email
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new BadRequestException("Không tìm thấy tài khoản");
      }
      // Gửi email
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Chờ thanh toán', // Tiêu đề
        template: "awaitting_payment",
        context: {
          name: user?.name ?? user.email,
        },
      });

      console.log(`Email sent to: ${user.email}`);
    } catch (error) {
      console.error(`Error sending email to ${email}:`, error);
      throw new Error(`Failed to send email to ${email}`);
    }
  }
  // send mail with payment success
  async sendMailPaymentSuccess(email: string, roomNumber: string) {
    console.log(email);
    try {
      // Kiểm tra email
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new BadRequestException("Không tìm thấy tài khoản");
      }
      // Gửi email
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Thanh toán thành công', // Tiêu đề
        template: "success_payment",
        context: {
          name: user?.name ?? user.email,
          roomNumber: roomNumber,
        },
      });
      console.log(`Email sent to: ${user.email}`);
    } catch (error) {
      console.error(`Error sending email to ${email}:`, error);
      throw new Error(`Failed to send email to ${email}`);
    }
  }



  async retryPassword(email: string) {
    //check email
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException("Tài khoản không tồn tại")
    }


    //send Email
    const codeId = uuidv4();

    //update user
    await user.updateOne({
      codeId: codeId,
      codeExpired: dayjs().add(5, 'minutes')
    })

    //send email
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      subject: 'Đổi mật khẩu của bạn tại KTXM', // Subject line
      template: "register",
      context: {
        name: user?.name ?? user.email,
        activationCode: codeId
      }
    })
    return { _id: user._id, email: user.email }
  }

  async changePassword(data: ChangePasswordAuthDto) {
    if (data.confirmPassword !== data.password) {
      throw new BadRequestException("Mật khẩu/xác nhận mật khẩu không chính xác.")
    }

    //check email
    const user = await this.userModel.findOne({ email: data.email });

    if (!user) {
      throw new BadRequestException("Tài khoản không tồn tại")
    }

    //check expire code
    const isBeforeCheck = dayjs().isBefore(user.codeExpired);

    if (isBeforeCheck) {
      //valid => update password
      const newPassword = await hashPasswordHelper(data.password);
      await user.updateOne({ password: newPassword })
      return { isBeforeCheck };
    } else {
      throw new BadRequestException("Mã code không hợp lệ hoặc đã hết hạn")
    }

  }

}
