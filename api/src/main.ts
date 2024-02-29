import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { GasLogger } from './app.logger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: new GasLogger()
    });
    app.enableCors({
        origin: true,
        optionsSuccessStatus: 200,
        exposedHeaders: ['Content-Disposition']
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3000, '0.0.0.0')
}
bootstrap();
