import { Module } from '@nestjs/common';

import { SlidesModule } from 'src/slides/slides.module';
import { Slide } from 'src/slides/slide.entity';

import { SongsService } from './songs.service';
import { songsProviders } from './songs.providers';
import { SongsController } from './songs.controller';

@Module({
    controllers: [SongsController],
    imports: [Slide],
    providers: [SongsService, SlidesModule, ...songsProviders]
})
export class SongsModule { }
