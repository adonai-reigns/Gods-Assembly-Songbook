import { Module } from '@nestjs/common';

import { SlidesModule } from 'src/slides/slides.module';

import { SongsService } from './songs.service';
import { SlidesService } from 'src/slides/slides.service';

import { songsProviders } from './songs.providers';
import { SongsController } from './songs.controller';
import { slidesProviders } from 'src/slides/slides.providers';

@Module({
    controllers: [SongsController],
    imports: [SlidesModule],
    providers: [SlidesModule, SongsService, SlidesService, ...songsProviders, ...slidesProviders]
})
export class SongsModule { }
