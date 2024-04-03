/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:4200'
  });

  const port = process.env.PORT || 3000;

  const config = new DocumentBuilder()
    .setTitle('Stijns Burgers API')
    .setDescription('Op deze pagina vindt je alle endpoints van de Stijns Burgers API. Ook kun je zien op welke manier de endpoint benadert moeten worden.')
    .setVersion('1.0')
    .addTag('stijns-burgers')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  Logger.log(
    `data-api: 🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
