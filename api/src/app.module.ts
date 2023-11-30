import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { AppController } from './app.controller';

import { DatabaseModule } from './database/database.module';
import { SlidesModule } from './slides/slides.module';
import { SongsModule } from './songs/songs.module';

@Module({
    imports: [SongsModule, DatabaseModule, SlidesModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
