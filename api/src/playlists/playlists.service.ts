import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';

import { Song } from 'src/songs/song.entity';
import { Slide } from 'src/slides/slide.entity';
import { Playlist, PlaylistSong } from './playlist.entity';

@Injectable()
export class PlaylistsService {

    constructor(
        @Inject('PlaylistsRepository') private readonly PlaylistsRepository: typeof Playlist,
        @Inject('PlaylistsSongsRepository') private readonly PlaylistsSongsRepository: typeof PlaylistSong
    ) { }

    async findAll(): Promise<Playlist[]> {
        const playlists = await this.PlaylistsRepository.findAll<Playlist>({
            include: [{
                model: Song,
                as: 'songs',
                include: [
                    {
                        model: Slide,
                        as: 'slides'
                    }
                ],
            }],
            order: [
                ['updatedAt', 'DESC'],
                [Sequelize.literal('`songs->playlistSong`.`sorting`'), 'ASC'],
                [{ model: Song, as: 'songs' }, { model: Slide, as: 'slides' }, 'sorting', 'ASC'],
            ]
        });
        return playlists;
    }

    async findOne(id: number): Promise<Playlist> {
        const playlist = await this.PlaylistsRepository.findByPk<Playlist>(id, {
            include: [{
                model: Song,
                as: 'songs',
                include: [
                    {
                        model: Slide,
                        as: 'slides'
                    }
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

        const playlistSongs = await this.PlaylistsSongsRepository.findAll({
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

    async unassignSongsFromPlaylist(playlistId: number, songs: Song[]): Promise<Playlist> {
        for (let song of songs) {
            try {
                await this.PlaylistsSongsRepository.destroy({
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
                await this.PlaylistsSongsRepository.create({
                    playlistId: parseInt(`${playlistId}`),
                    songId: parseInt(song.id)
                });
            } catch (e: any) { }

        }
        return await this.findOne(playlistId) as Playlist;
    }

    async delete(id: number) {
        const playlist = await this.findOne(id) as Playlist;
        await playlist.destroy();
    }

}
