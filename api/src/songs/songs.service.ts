import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';

import { Song } from './song.entity';
import { Slide } from 'src/slides/slide.entity';

@Injectable()
export class SongsService {

    constructor(@Inject('SongsRepository') private readonly SongsRepository: typeof Song) { }

    async findAll(): Promise<Song[]> {
        const songs = await this.SongsRepository.findAll<Song>({
            include: [Slide],
            order: [[{ model: Slide, as: 'slides' }, 'sorting', 'ASC']]
        });
        return songs;
    }

    async findOne(id: number): Promise<Song> {
        const song = await this.SongsRepository.findByPk<Song>(id, {
            include: [Slide],
            order: [[{ model: Slide, as: 'slides' }, 'sorting', 'ASC']]
        });
        if (!song) {
            throw new HttpException('No song found', HttpStatus.NOT_FOUND);
        }
        return song;
    }

    async create(createSongDto: CreateSongDto): Promise<Song> {
        const song = new Song();
        song.name = createSongDto.name;
        song.sorting = createSongDto.sorting;
        return song.save();
    }

    async update(id: number, updateSongDto: UpdateSongDto) {
        const song = await this.findOne(id) as Song;
        song.name = updateSongDto.name || song.name;
        song.sorting = updateSongDto.sorting || song.sorting;
        return song.save();
    }

    async delete(id: number) {
        const song = await this.findOne(id) as Song;
        await song.destroy();
    }

}
