import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { AppController } from './app.controller';

import { DatabaseModule } from './database/database.module';
import { SlidesModule } from './slides/slides.module';
import { SongsModule } from './songs/songs.module';
import { LiveModule } from './live/live.module';
import { ScreensModule } from './screens/screens.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { WallpapersModule } from './wallpapers/wallpapers.module';
import { SettingsModule } from './settings/settings.module';

@Module({
    imports: [SongsModule, DatabaseModule, SlidesModule, LiveModule, ScreensModule, PlaylistsModule, WallpapersModule, SettingsModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
