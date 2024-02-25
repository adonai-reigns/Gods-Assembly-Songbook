import { Controller, Get, Post, Put, Patch, Delete, Param, Body } from '@nestjs/common';

import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';

import { Playlist } from './playlist.entity';

import { PlaylistsService } from './playlists.service';
import { SongDto } from 'src/songs/dto/song.dto';

@Controller('playlists')
export class PlaylistsController {

    constructor(
        private readonly playlistsService: PlaylistsService
    ) { }

    @Get()
    findAll(): Promise<Playlist[]> {
        return this.playlistsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Playlist> {
        return this.playlistsService.findOne(id);
    }

    @Post()
    async create(@Body() createPlaylistDto: CreatePlaylistDto): Promise<Playlist> {
        return this.playlistsService.create(createPlaylistDto);
    }

    @Patch(':id')
    async update(@Param('id') id: number, @Body() playlist: UpdatePlaylistDto): Promise<Playlist> {
        return this.playlistsService.update(id, playlist);
    }

    @Put(':id')
    async replace(@Param('id') id: number, @Body() playlist: CreatePlaylistDto): Promise<Playlist> {
        return this.playlistsService.update(id, playlist);
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        await this.playlistsService.delete(id);
    }

    @Post(':id/setSongSorting')
    async setSorting(@Param('id') id: number, @Body('sortedSongIds') updatePlaylistDto: UpdatePlaylistDto): Promise<Playlist> {
        return await this.playlistsService.update(id, updatePlaylistDto);
    }

    @Post(':id/addSongs')
    async addSongs(@Param('id') id: number, @Body('songs') songs: SongDto[]): Promise<Playlist> {
        return await this.playlistsService.addSongsToPlaylist(id, songs);
    }

    @Delete(':id/deleteSong/:songId')
    async deleteSong(@Param('id') id: number, @Param('songId') songId: number){
        return await this.playlistsService.deleteSongFromPlaylist(id, songId);
    }

}
