import { Module } from '@nestjs/common';
import { PlaylistsController } from './playlists.controller';
import { PlaylistsService } from './playlists.service';
import { playlistsProviders } from './playlists.providers';
import { songsProviders } from 'src/songs/songs.providers';
import { SongsModule } from 'src/songs/songs.module';
import { SongsService } from 'src/songs/songs.service';
import { SlidesService } from 'src/slides/slides.service';
import { SlidesModule } from 'src/slides/slides.module';
import { slidesProviders } from 'src/slides/slides.providers';

@Module({
    controllers: [PlaylistsController],
    imports: [SongsModule, SlidesModule],
    providers: [PlaylistsService, SongsService, SlidesService, ...playlistsProviders, ...songsProviders, ...slidesProviders]
})
export class PlaylistsModule { }
