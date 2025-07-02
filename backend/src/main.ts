import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // Enable CORS for development and production
    app.enableCors({
        origin: process.env.NODE_ENV === 'production'
            ? ['https://equipment-app.onrender.com']
            : ['http://localhost:5173', 'http://localhost:3000'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // Serve static files in production
    if (process.env.NODE_ENV === 'production') {
        app.useStaticAssets(join(__dirname, '..', '..', 'frontend', 'dist'));
        app.setBaseViewsDir(join(__dirname, '..', '..', 'frontend', 'dist'));
    }

    await app.listen(process.env.PORT || 3000);
    console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
}
bootstrap();