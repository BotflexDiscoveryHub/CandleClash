import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { version } from '../package.json';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API description')
    .setVersion(version)
    .addSecurity('initData', {
      type: 'apiKey',
      in: 'header',
      name: 'x-init-data',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);

  app.enableCors({
    origin: [process.env.WEB_APP_URL || 'https://pavel-5000.1n.baby'],
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
