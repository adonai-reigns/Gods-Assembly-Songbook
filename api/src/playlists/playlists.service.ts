import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';

import { Song } from 'src/songs/song.entity';
import { Slide } from 'src/slides/slide.entity';
import { Playlist, PlaylistSong } from './playlist.entity';
import { SongsService } from 'src/songs/songs.service';
import { SongDto } from 'src/songs/dto/song.dto';
import { SongCopyright } from 'src/songs/songCopyright.entity';

@Injectable()
export class PlaylistsService {

    constructor(
        @Inject('PlaylistsRepository') private readonly playlistsRepository: typeof Playlist,
        @Inject('PlaylistsSongsRepository') private readonly playlistsSongsRepository: typeof PlaylistSong,
        private readonly songsService: SongsService
    ) { }

    async findAll(options: any = {}): Promise<Playlist[]> {
        const playlists = await this.playlistsRepository.findAll<Playlist>({
            include: [{
                model: Song,
                as: 'songs',
                include: [
                    {
                        model: Slide,
                        as: 'slides'
                    },
                    SongCopyright
                ],
            }],
            where: options?.where ?? undefined,
            order: [
                ['updatedAt', 'DESC'],
                [Sequelize.literal('`songs->playlistSong`.`sorting`'), 'ASC'],
                [{ model: Song, as: 'songs' }, { model: Slide, as: 'slides' }, 'sorting', 'ASC'],
            ]
        });
        return playlists;
    }

    async findOne(id: number): Promise<Playlist> {
        const playlist = await this.playlistsRepository.findByPk<Playlist>(id, {
            include: [{
                model: Song,
                as: 'songs',
                include: [
                    {
                        model: Slide,
                        as: 'slides'
                    },
                    SongCopyright
                ],
            }],
            order: [
                [Sequelize.literal('`songs->playlistSong`.`sorting`'), 'ASC'],
                [{ model: Song, as: 'songs' }, { model: Slide, as: 'slides' }, 'sorting', 'ASC']
            ]
        });
        if (!playlist) {
            throw new HttpException('No playlist found', HttpStatus.NOT_FOUND);
        }
        return playlist;
    }

    async findAllByPk(ids: number[] = []): Promise<Playlist[]> {
        return this.findAll({ where: { [Playlist.primaryKeyAttribute]: { [Op.in]: ids } } });
    }

    async create(createPlaylistDto: CreatePlaylistDto): Promise<Playlist> {
        const playlist = new Playlist();
        playlist.name = createPlaylistDto.name;
        playlist.songs = createPlaylistDto.songs;
        return playlist.save();
    }

    async update(id: number, updatePlaylistDto: UpdatePlaylistDto) {

        const playlist = await this.findOne(id) as Playlist;
        playlist.name = updatePlaylistDto.name || playlist.name;
        playlist.startSlide = updatePlaylistDto.startSlide || playlist.startSlide;
        playlist.pauseSlide = updatePlaylistDto.pauseSlide || playlist.pauseSlide;
        playlist.endSlide = updatePlaylistDto.endSlide || playlist.endSlide;

        const playlistSongs = await this.playlistsSongsRepository.findAll({
            where: {
                playlistId: { [Op.eq]: id },
                songId: { [Op.in]: updatePlaylistDto.songs.map((song: Song) => song.id) }
            }
        });

        if (typeof updatePlaylistDto.songs === typeof []) {

            let deletedSongs = playlist.songs.filter((song: Song) => updatePlaylistDto.songs.map((_song: Song) => _song.id).indexOf(song.id) < 0);
            if (deletedSongs.length) {
                await this.unassignSongsFromPlaylist(id, deletedSongs);
            }

            let newSongs = updatePlaylistDto.songs.filter((song: Song) => playlist.songs.map((_song: Song) => _song.id).indexOf(song.id) < 0);
            if (newSongs.length) {
                await this.assignSongsToPlaylist(id, newSongs);
            }

        }

        return playlist.save();

    }

    async addSongsToPlaylist(playlistId: number, songs: SongDto[]): Promise<Playlist> {
        try {
            let newSongs = [];
            for (let songTemplate of songs) {
                newSongs.push(await this.songsService.duplicate(songTemplate));
            }
            await this.assignSongsToPlaylist(playlistId, newSongs);
        } catch (e: any) {
            console.error('Error in [playlist.service].addSongsToPlaylist()', e, playlistId, songs);
        }
        return await this.findOne(playlistId) as Playlist;
    }

    async unassignSongsFromPlaylist(playlistId: number, songs: Song[]): Promise<Playlist> {
        for (let song of songs) {
            try {
                await this.playlistsSongsRepository.destroy({
                    where: {
                        playlistId: parseInt(`${playlistId}`),
                        songId: parseInt(song.id)
                    }
                });
            } catch (e: any) { }
        }
        return await this.findOne(playlistId) as Playlist;
    }

    async assignSongsToPlaylist(playlistId: number, songs: Song[]): Promise<Playlist> {
        for (let song of songs) {
            try {
                let sortingMax = await this.playlistsSongsRepository.findOne({ where: { playlistId }, order: [['sorting', 'DESC']] });
                await this.playlistsSongsRepository.create({
                    playlistId: parseInt(`${playlistId}`),
                    songId: parseInt(`${song.id}`),
                    sorting: parseInt(`${sortingMax?.sorting ?? 0}`) + 1
                });
            } catch (e: any) { }
        }
        return await this.findOne(playlistId) as Playlist;
    }

    async deleteSongFromPlaylist(playlistId: number, songId: number): Promise<Playlist> {
        try {
            let playlistSong = await this.playlistsSongsRepository.findOne({ where: { playlistId, songId: songId } });
            if (playlistSong) {
                try {
                    await this.songsService.delete(songId);
                    await this.playlistsSongsRepository.destroy({ where: { playlistId, songId: songId } });
                } catch (e) { }
                try {
                    await this.playlistsSongsRepository.update({
                        sorting: Sequelize.literal('sorting - 1')
                    }, {
                        where: {
                            playlistId: parseInt(`${playlistId}`),
                            sorting: Sequelize.literal('(sorting - ' + playlistSong.sorting + ') > 0')
                        }
                    });
                } catch (e: any) { }
            }
        } catch (e: any) { }
        return await this.findOne(playlistId) as Playlist;
    }

    async delete(id: number) {
        const playlist = await this.findOne(id) as Playlist;
        await playlist.destroy();
    }

}
