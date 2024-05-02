import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {

  const app = await NestFactory.create(AppModule, 
    { 
      logger: undefined,
    }
  );

  await app.listen(3005);
  console.log(`[App] App started in 'http://localhost:3005'`);
}
bootstrap();