import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { get, set, isEmpty } from 'lodash';
import { Op } from 'sequelize';

import { CreateSongCopyrightDto, CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';

import { Song } from './song.entity';
import { Slide } from 'src/slides/slide.entity';

import { SongDto } from './dto/song.dto';
import { SlideDto } from 'src/slides/dto/slide.dto';
import { SlidesService } from 'src/slides/slides.service';
import { Playlist } from 'src/playlists/playlist.entity';
import { SongCopyright } from './songCopyright.entity';
import { CreateSlideDto } from 'src/slides/dto/create-slide.dto';

@Injectable()
export class SongsService {

    constructor(
        @Inject('SongsRepository') private readonly songsRepository: typeof Song,
        private readonly slidesService: SlidesService
    ) { }

    async findAll(options: any): Promise<Song[]> {
        const songs = await this.songsRepository.findAll<Song>({
            include: [Slide, Playlist, SongCopyright],
            where: options.where ?? undefined,
            order: [[{ model: Slide, as: 'slides' }, 'sorting', 'ASC'], ['sorting', 'ASC']]
        });
        return songs;
    }

    async findOne(id: number): Promise<Song> {
        const song = await this.songsRepository.findByPk<Song>(id, {
            include: [Slide, Playlist, SongCopyright],
            order: [[{ model: Slide, as: 'slides' }, 'sorting', 'ASC']]
        });
        if (!song) {
            throw new HttpException('No song found', HttpStatus.NOT_FOUND);
        }
        return song;
    }

    async findAllByPk(ids: number[]): Promise<Song[]> {
        return this.findAll({ where: { [Song.primaryKeyAttribute]: { [Op.in]: ids } } });
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
        song.copyright = new SongCopyright(createSongDto.copyright);
        for (let field of Object.keys(createSongDto.copyright)) {
            set(song.copyright, field, get(createSongDto.copyright, field));
        }
        await song.copyright.save();
        song.songCopyrightId = song.copyright.id;
        await song.save();
        for (let slide of createSongDto.slides ?? []) {
            this.slidesService.create({ ...slide, songId: song.id } as CreateSlideDto).then((newSlide: Slide) => song.slides.push(newSlide));
        }
        return song.save();
    }

    async update(id: number, updateSongDto: UpdateSongDto) {
        const song = await this.findOne(id) as Song;
        song.name = updateSongDto.name || song.name;
        song.sorting = updateSongDto.sorting || song.sorting;
        if (!isEmpty(updateSongDto.copyright)) {
            for (let field of Object.keys(updateSongDto.copyright)) {
                if ((Object.keys(song.copyright.dataValues).indexOf(field) > -1)) {
                    set(song.copyright, field, get(updateSongDto.copyright, field));
                }
            }
            song.copyright.save();
        }
        song.copyright = updateSongDto.copyright || song.copyright;
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
            copyright: song.copyright,
            slides: []
        });
        newSong.songCopyrightId = song.copyright.id;
        let newSongId = (await newSong.save()).id;
        newSong.slides = [];
        for (let slide of song.slides) {
            this.slidesService.duplicate(slide as SlideDto, newSongId).then((newSlide: Slide) => newSong.slides.push(newSlide));
        }
        return this.findOne(newSongId);
    }

}
