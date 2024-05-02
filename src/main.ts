import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './../libs/sco-backend-fw-core/src/core/logger/logger.service';

async function bootstrap() {

  const app = await NestFactory.create(AppModule, 
    { 
      logger: new LoggerService(),
    }
  );

  await app.listen(3005);
  console.log(`[App] App started in 'http://localhost:3005'`);
}
bootstrap();