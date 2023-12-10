import { Module } from '@nestjs/common';
import { PlaylistsController } from './playlists.controller';
import { PlaylistsService } from './playlists.service';
import { playlistsProviders } from './playlists.providers';

@Module({
    controllers: [PlaylistsController],
    providers: [PlaylistsService, ...playlistsProviders]
})
export class PlaylistsModule { }
