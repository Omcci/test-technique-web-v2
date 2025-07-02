import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS for development and production
    app.enableCors({
        origin: process.env.NODE_ENV === 'production'
            ? ['https://equipment-frontend.onrender.com']
            : ['http://localhost:5173', 'http://localhost:3000'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });

    await app.listen(process.env.PORT || 3000);
    console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
}
bootstrap();