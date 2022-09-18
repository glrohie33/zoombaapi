import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import allowedlist from './utils/allowedlist';
console.log(process.argv);
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: allowedlist,
      credentials: true,
    },
  });
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb' }));
  app.use(new cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: false }));
  const config = new DocumentBuilder()
    .setTitle('Zoomba 2.0')
    .setDescription('Zoomba 2.0 api documentation')
    .setVersion('1.0')
    .addTag('Zoomba')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
