import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Libera acesso ao frontend Vite (http://localhost:5173)
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  // ✅ Aplica validações automaticamente em DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove campos extras
      forbidNonWhitelisted: true, // recusa campos não esperados
      transform: true, // transforma tipos (ex: string para number)
    })
  );

  // (Opcional) app.setGlobalPrefix('api'); // para rotas começarem com /api

  await app.listen(3000);
}
bootstrap();
