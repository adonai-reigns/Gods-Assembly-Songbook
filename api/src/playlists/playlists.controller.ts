import { Controller, Get, Post, Put, Patch, Delete, Param, Body, Res, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { isEmpty, union, uniq, uniqueId } from 'lodash';
import { format as dateFormat } from 'date-fns';
import { randomUUID } from 'crypto';

import { decode as decodeHtml } from 'html-entities';
import { parse as parseHtml } from 'node-html-parser';
import { renderToStaticMarkup } from 'react-dom/server';

const AdmZip = require('adm-zip');
import { IZipEntry } from 'adm-zip';

import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { ExportPlaylistDto } from './dto/export-playlist.dto';
import { SongDto } from 'src/songs/dto/song.dto';
import { ExportSongDto } from 'src/songs/dto/export-song.dto';

import { ExportPlaylistTemplate } from './playlists.export.template';
import { ExportSongTemplate } from 'src/songs/songs.export.template';

import { Playlist } from './playlist.entity';

import { toFilename } from 'src/app.service';
import { PlaylistsService } from './playlists.service';

import * as config from 'config';

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
    async deleteSong(@Param('id') id: number, @Param('songId') songId: number) {
        return await this.playlistsService.deleteSongFromPlaylist(id, songId);
    }

    @Post('export')
    async export(@Body('playlistIds') playlistIds: number[], @Res({ passthrough: true }) response: Response, @Body('format') format: "json" | "text" = 'json'): Promise<StreamableFile> {
        let exportId = randomUUID();
        let filename = config.get("exports.playlists.filename");
        filename = filename.replace("{id}", exportId);
        filename = filename.replace("{date}", dateFormat(new Date(), 'yyyy-M-d'));
        let zip = new AdmZip();
        let playlists = (await this.playlistsService.findAllByPk(playlistIds)).map((playlist: Playlist) => new ExportPlaylistDto(playlist));
        let playlistNames = playlists.map((playlist: ExportPlaylistDto) => toFilename(playlist.name + '_' + dateFormat(new Date(playlist.createdAt), 'yyyyMMdd')));
        let duplicatePlaylistNames = union(playlistNames, uniq(playlistNames));
        playlists.map((playlist: ExportPlaylistDto) => {

            let playlistName = toFilename(playlist.name);
            if (duplicatePlaylistNames.indexOf(playlistName) > -1) {
                playlistName = toFilename(playlistName + '_' + dateFormat(new Date(playlist.createdAt), 'yyyyMMdd HH:mm:ss'));
            }
            switch (format) {
                case 'json':
                    zip.addFile(playlistName + '.json', JSON.stringify(playlist, null, 2));
                    break;
                case 'text':
                    filename = filename.replace("{ext}", 'zip');
                    zip.addFile(playlistName + '.txt', Buffer.from(decodeHtml(parseHtml(renderToStaticMarkup(ExportPlaylistTemplate(playlist))).innerText.trim()), "utf8"));
                    let songFilenames: string[] = playlist.songs.map((song: ExportSongDto) => toFilename(song.name));
                    let duplicateFilenames: string[] = union(songFilenames, uniq(songFilenames));
                    for (let song of playlist.songs) {
                        let songFilename = toFilename(song.name);
                        if (duplicateFilenames.indexOf(songFilename) > -1) {
                            let unique = !isEmpty(song.copyright.year)
                                ? ` (${song.copyright.year})`
                                : !isEmpty(song.copyright.publisher)
                                    ? ` (${song.copyright.publisher})`
                                    : !isEmpty(song.copyright.author)
                                        ? `(${song.copyright.author})`
                                        : uniqueId()
                                ;
                            songFilename = toFilename(song.name + unique);
                        }
                        while (zip.getEntries().filter((entry: IZipEntry) => entry.entryName === songFilename + '.txt').length > 0) {
                            songFilename = uniqueId(songFilename);
                        }
                        zip.addFile(playlistName + '_songs/' + songFilename + '.txt', Buffer.from(decodeHtml(parseHtml(renderToStaticMarkup(ExportSongTemplate(song))).innerText.trim()), "utf8"));
                    }
                    break;
            }
        });
        response.set({
            'Content-Disposition': 'inline; filename="' + filename.replace("{ext}", 'zip') + '"',
            'Cache-Control': 'no-cache',
            'Mime-Type': 'application/zip'
        });
        return new StreamableFile(zip.toBuffer());
    }
}
