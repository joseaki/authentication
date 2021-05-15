import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import Global from './config/global.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3001', 'https://sms-front-admin2.vercel.app'],
    credentials: true,
  });
  app.use(cookieParser(['secret 1', 'secret 2']));
  const config = new DocumentBuilder()
    .setTitle('Authentication MS')
    .setDescription('Microservice for user authentication')
    .setVersion('1.0')
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(Global.port);
}
bootstrap();
