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

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,

    private readonly mailerService: MailerService
  ) { }

  // Kiểm tra email đã tồn tại chưa
  isEmailExist = async (email: string) => {
    const user = await this.userModel.exists({ email });
    if (user) return true;
    return false;
  }

  isUsserIdExist = async (userId: string) => {
    const user = await this.userModel.exists({ userId });
    if (user) return true;
    return false;
  }

  async create(createUserDto: CreateUserDto) {
    const { name, email, userId, password, phone, address, image, role } = createUserDto;

    //check email
    const isExist = await this.isEmailExist(email);
    if (isExist === true) {
      throw new BadRequestException(`Email đã tồn tại: ${email}. Vui lòng sử dụng email khác.`)
    }
    const isUserIdExist = await this.isUsserIdExist(userId);
    if (isUserIdExist === true) {
      throw new BadRequestException(`Mã số sinh viên đã tồn tại: ${userId}. Vui lòng sử dụng mã số khác.`)
    }

    //hash password
    const hashPassword = await hashPasswordHelper(password);
    const user = await this.userModel.create({
      name, email, userId, password: hashPassword, phone, address, image, role
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

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const skip = (current - 1) * (pageSize);

    const results = await this.userModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .select("-password")
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
    return `This action returns a #${id} user`;
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email })
  }

  async findByUserId(userId: string) {
    return await this.userModel.findOne({ userId })
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      { _id: updateUserDto._id }, { ...updateUserDto });
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

    const isUserIdExist = await this.isUsserIdExist(userId);
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
