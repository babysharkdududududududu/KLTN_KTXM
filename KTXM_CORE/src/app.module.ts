import { DormPaymentModule } from './modules/dorm_payment/dorm_payment.module';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthModule } from '@/auth/auth.module';
import { TransformInterceptor } from '@/core/transform.interceptor';
import { ContractsModule } from '@/modules/contracts/contracts.module';
import { SettingModule } from '@/modules/setting/setting.module';
import { UsersModule } from '@/modules/users/users.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { DormSubmissionModule } from './modules/dorm_submission/dorm_submission.module';
import { EquipmentModule } from './modules/equipment/equipment.module';
import { MaintenanceModule } from './modules/maintenance/maintenance.module';
import { NotificationModule } from './modules/notification/notification.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { SocketModule } from './socketgateway/socket.module';
import { StudentDisciplineModule } from './modules/student-discipline/student-discipline.module';
import { StatisticModule } from './modules/statistic/statistic.module';
import { DormBillModule } from './modules/dorm_bill/dorm_bill.module';

@Module({
  imports: [
    SocketModule,
    UsersModule,
    AuthModule,
    NotificationModule,
    MaintenanceModule,
    RoomsModule,
    SettingModule,
    EquipmentModule,
    ContractsModule,
    DormPaymentModule,
    DormSubmissionModule,
    StatisticModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          // ignoreTLS: true,
          // secure: false,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>',
        },
        // preview: true,
        template: {
          dir: process.cwd() + '/src/mail/templates/',
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],

    }),
    ContractsModule,
    MaintenanceModule,
    StudentDisciplineModule,
    DormBillModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule { }
