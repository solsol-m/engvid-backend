import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: true, credentials: true });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // أوقفنا عملية التفريغ التلقائي لقاعدة البيانات لضمان عدم ضياع فيديوهاتك المرفوعة
  // await seedDatabase(videoModel); 

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  console.log(`EngVid backend running on http://localhost:${port}/api`);
}
bootstrap();
