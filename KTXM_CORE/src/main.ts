import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  app.setGlobalPrefix('api/v1', { exclude: [''] });
  app.setGlobalPrefix('api/v1');

  app.useStaticAssets(join(__dirname, '..', 'public')); // Cấu hình thư mục tĩnh (cho CSS, JS, hình ảnh)
  app.setBaseViewsDir(join(__dirname, '..', 'views'));  // Thư mục chứa file .ejs
  app.setViewEngine('ejs');  // Sử dụng EJS làm view engine


  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }));

  //config cors
  app.enableCors(
    {
      //origin: "http://14.225.211.35:3001",
      "origin": true,
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "preflightContinue": false,
      credentials: true
    }
  );

  await app.listen(port);
}
bootstrap();
