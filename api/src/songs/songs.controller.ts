import { Controller, Get, Post, Put, Delete, Param, Body, Patch } from '@nestjs/common';

import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';

import { Song } from './song.entity';

import { SongsService } from './songs.service';

@Controller('songs')
export class SongsController {

    constructor(
        private readonly songsService: SongsService
    ) { }

    @Get()
    findAll(): Promise<Song[]> {
        return this.songsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Song> {
        return this.songsService.findOne(id);
    }

    @Post()
    async create(@Body() createSongDto: CreateSongDto): Promise<Song> {
        return this.songsService.create(createSongDto);
    }

    @Patch(':id')
    async update(@Param('id') id: number, @Body() song: UpdateSongDto): Promise<Song> {
        return this.songsService.update(id, song);
    }

    @Put(':id')
    async replace(@Param('id') id: number, @Body() song: CreateSongDto): Promise<Song> {
        return this.songsService.update(id, song);
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        await this.songsService.delete(id);
    }

}
