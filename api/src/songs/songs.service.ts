import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';

import { Song } from './song.entity';
import { Slide } from 'src/slides/slide.entity';

import { SongDto } from './dto/song.dto';
import { SlideDto } from 'src/slides/dto/slide.dto';
import { SlidesService } from 'src/slides/slides.service';
import { Playlist } from 'src/playlists/playlist.entity';

@Injectable()
export class SongsService {

    constructor(
        @Inject('SongsRepository') private readonly songsRepository: typeof Song,
        private readonly slidesService: SlidesService
    ) { }

    async findAll(options: any): Promise<Song[]> {
        const songs = await this.songsRepository.findAll<Song>({
            include: [Slide],
            where: options.where ?? undefined,
            order: [[{ model: Slide, as: 'slides' }, 'sorting', 'ASC']]
        });
        return songs;
    }

    async findOne(id: number): Promise<Song> {
        const song = await this.songsRepository.findByPk<Song>(id, {
            include: [Slide, Playlist],
            order: [[{ model: Slide, as: 'slides' }, 'sorting', 'ASC']]
        });
        if (!song) {
            throw new HttpException('No song found', HttpStatus.NOT_FOUND);
        }
        return song;
    }

    async create(createSongDto: CreateSongDto): Promise<Song> {
        let songTemplate = null;
        if (createSongDto.songTemplateId) {
            songTemplate = await this.findOne(createSongDto.songTemplateId);
        }
        const song = new Song();
        song.name = createSongDto.name;
        song.sorting = createSongDto.sorting;
        song.songTemplateId = songTemplate?.id ?? null;
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

    async duplicate(song: SongDto): Promise<Song> {
        let newSong = new Song({
            name: song.name,
            songTemplateId: song.id,
            slides: []
        });
        let newSongId = (await newSong.save()).id;
        newSong.slides = [];
        for (let slide of song.slides) {
            this.slidesService.duplicate(slide as SlideDto, newSongId).then((newSlide: Slide) => newSong.slides.push(newSlide));
        }
        return this.findOne(newSongId);
    }

}
