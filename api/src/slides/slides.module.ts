import { Module } from '@nestjs/common';
import { SlidesService } from './slides.service';
import { slidesProviders } from './slides.providers';
import { SlidesController } from './slides.controller';
import { Song } from 'src/songs/song.entity';

@Module({
    controllers: [SlidesController],
    imports: [Song],
    providers: [SlidesService, ...slidesProviders]
})
export class SlidesModule { }
