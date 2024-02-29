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

import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { ExportSongDto } from './dto/export-song.dto';

import { ExportSongTemplate } from './songs.export.template';

import { Song } from './song.entity';

import { toFilename } from 'src/app.service';
import { SongsService } from './songs.service';

import * as config from 'config';

@Controller('songs')
export class SongsController {

    constructor(
        private readonly songsService: SongsService
    ) { }

    @Get()
    findAll(): Promise<Song[]> {
        return this.songsService.findAll({ where: { songTemplateId: null } });
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

    @Post('export')
    async export(@Body('songIds') songIds: number[], @Res({ passthrough: true }) response: Response, @Body('format') format: "json" | "text" = 'json'): Promise<StreamableFile> {
        let exportId = randomUUID();
        let filename = config.get("exports.songs.filename");
        filename = filename.replace("{id}", exportId);
        filename = filename.replace("{date}", dateFormat(new Date(), 'yyyy-M-d'));
        let songs = (await this.songsService.findAllByPk(songIds)).map((song: Song) => new ExportSongDto(song));
        let zip = new AdmZip();
        switch (format) {
            case 'json':
                zip.addFile('songs.json', JSON.stringify(songs, null, 2));
                response.set({
                    'Content-Disposition': 'inline; filename="' + filename.replace("{ext}", 'zip') + '"',
                    'Cache-Control': 'no-cache',
                    'Mime-Type': 'application/zip'
                });
                return new StreamableFile(zip.toBuffer());
            case 'text':
                filename = filename.replace("{ext}", 'zip');
                let songFilenames: string[] = songs.map((song: ExportSongDto) => toFilename(song.name));
                let duplicateFilenames: string[] = union(songFilenames, uniq(songFilenames));
                for (let song of songs) {
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
                    zip.addFile('songs/' + songFilename + '.txt', Buffer.from(decodeHtml(parseHtml(renderToStaticMarkup(ExportSongTemplate(song))).innerText.trim()), "utf8"));
                }
                response.set({
                    'Content-Disposition': 'inline; filename="' + filename.replace("{ext}", 'zip') + '"',
                    'Cache-Control': 'no-cache',
                    'Mime-Type': 'application/zip'
                });
                return new StreamableFile(zip.toBuffer());
        }
    }
}
