import { Module } from '@nestjs/common';
import { SlidesService } from './slides.service';
import { slidesProviders } from './slides.providers';
import { SlidesController } from './slides.controller';

@Module({
    providers: [SlidesService, ...slidesProviders],
    controllers: [SlidesController]
})
export class SlidesModule { }
