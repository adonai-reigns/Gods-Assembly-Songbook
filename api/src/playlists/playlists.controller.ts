import {Controller, Res, StreamableFile, BadRequestException, Get, Post, Put, Patch, Delete, Param, Body, UploadedFiles, FileTypeValidator, UseInterceptors, ParseFilePipe, MaxFileSizeValidator, Logger } from '@nestjs/common';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { isArray, isEmpty, union, uniq, uniqueId } from 'lodash';
import { format as dateFormat } from 'date-fns';
import { randomUUID } from 'crypto';

import { join } from 'path';
import { readdirSync, rmSync, statSync } from 'fs';
import { getAbsoluteUploadPath, toFilename } from 'src/app.service';

import { decode as decodeHtml } from 'html-entities';
import { parse as parseHtml } from 'node-html-parser';
import { renderToStaticMarkup } from 'react-dom/server';

const AdmZip = require('adm-zip');
import { IZipEntry } from 'adm-zip';

import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { ExportApiVersion, ExportMetadataDto, ExportPlaylistDto, MetadataDescription } from './dto/export-playlist.dto';
import { SongDto } from 'src/songs/dto/song.dto';
import { CreateSongDto } from 'src/songs/dto/create-song.dto';
import { ExportSongDto, ImportFile } from 'src/songs/dto/export-song.dto';

import { ExportPlaylistTemplate } from './playlists.export.template';
import { ExportSongTemplate } from 'src/songs/songs.export.template';

import { Playlist } from './playlist.entity';
import { Song } from 'src/songs/song.entity';

import { PlaylistsService } from './playlists.service';
import { SongsService } from 'src/songs/songs.service';

import * as config from 'config';

@Controller('playlists')
export class PlaylistsController {
    private logger = new Logger(PlaylistsController.name);
    constructor(
        private readonly playlistsService: PlaylistsService,
        private readonly songsService: SongsService,
    ) { }

    @Get()
    findAll(): Promise<Playlist[]> {
        return this.playlistsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Playlist> {
        return this.playlistsService.findOne(id);
    }

    @Get('/many/:ids')
    async findMany(@Param('ids') ids: number[]): Promise<ExportPlaylistDto[]> {
        if (!isArray(ids)) {
            ids = JSON.parse(ids);
        }
        const playlists = await this.playlistsService.findAllByPk(ids);
        let playlistsExport = playlists.map((playlist: Playlist) => new ExportPlaylistDto(playlist));
        return playlistsExport;
    }

    @Post()
    async create(@Body() createPlaylistDto: CreatePlaylistDto): Promise<Playlist> {
        return this.playlistsService.create(new CreatePlaylistDto(createPlaylistDto));
    }

    @Patch(':id')
    async update(@Param('id') id: number, @Body() playlist: UpdatePlaylistDto): Promise<Playlist> {
        return this.playlistsService.update(id, playlist);
    }

    @Put(':id')
    async replace(@Param('id') id: number, @Body() playlist: UpdatePlaylistDto): Promise<Playlist> {
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
        let metaData = new ExportMetadataDto();
        metaData.description = MetadataDescription.playlists;
        metaData.apiVersion = ExportApiVersion.v1;
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
                    metaData.format = 'json';
                    metaData.playlistFilenames.push(playlistName + '.json');
                    break;
                case 'text':
                    zip.addFile(playlistName + '.txt', Buffer.from(decodeHtml(parseHtml(renderToStaticMarkup(ExportPlaylistTemplate(playlist))).innerText.trim()), "utf8"));
                    metaData.format = 'text';
                    metaData.playlistFilenames.push(playlistName + '.txt');
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
                        metaData.songFilenames.push(playlistName + '_songs/' + songFilename + '.txt');
                    }
                    break;
            }
        });
        zip.addFile('.metadata.json', JSON.stringify(metaData, null, 2));
        response.set({
            'Content-Disposition': 'inline; filename="' + filename.replace("{ext}", 'zip') + '"',
            'Cache-Control': 'no-cache',
            'Mime-Type': 'application/zip'
        });
        return new StreamableFile(zip.toBuffer());
    }

    @Post('uploadImport')
    @UseInterceptors(FilesInterceptor('files[]', config.get('imports.maxParallelUploadCount'), {
        storage: diskStorage({
            destination: getAbsoluteUploadPath(config.get('imports.tempDirectory')),
            filename: (req, file, callback) => {
                const uuid = randomUUID();
                const ext = file.originalname.split('.').pop();
                callback(null, `${uuid}.${ext}`);
            },
        }),
        fileFilter(req, file, callback) {
            let isValid = true;
            if (['application/zip'].indexOf(file.mimetype) < 0) {
                isValid = false;
            }
            callback(null, isValid);
        },
        limits: {
            fileSize: (1024 * 1024 * (Math.round(config.get('imports.maxFileSizeMB'))))
        }
    }))
    async uploadImport(
        @UploadedFiles(
            new ParseFilePipe(
                {
                    validators: [
                        new MaxFileSizeValidator({ maxSize: (1024 * 1024 * (Math.round(config.get('imports.maxFileSizeMB')))) }),
                        new FileTypeValidator({ fileType: '.zip' }),
                    ],
                    exceptionFactory: (errorMessage) => {
                        if (errorMessage.match(/expected type/i)) {
                            let exts = config.get('fileUploads.wallpapers.validTypes') as Array<string>;
                            return new BadRequestException(`Must be a .zip file`);
                        } else {
                            return new BadRequestException(errorMessage);
                        }
                    },
                }
            )
        )
        files: Express.Multer.File[]
    ) {
        return this.import();
    }

    @Post('import')
    import(@Body('importFilenames') selectedFilenames: string[] = []) {
        let importFilenames = readdirSync(getAbsoluteUploadPath(config.get('imports.tempDirectory')));
        let importFiles: ImportFile[] = [];
        for (let filename of importFilenames) {
            if (filename.split('.').pop() !== 'zip') {
                continue;
            }
            try {
                let zip = new AdmZip(join(getAbsoluteUploadPath(config.get('imports.tempDirectory')), filename));
                let metadata = JSON.parse(zip.getEntries().filter((entry: IZipEntry) => entry.name === '.metadata.json')[0].getData().toString("utf8") ?? '');
                if (metadata.apiVersion !== ExportApiVersion.v1) {
                    continue;
                }
                let importFile = new ImportFile();
                importFile.filename = filename;
                importFile.metadata = metadata;
                importFile.stat = statSync(join(getAbsoluteUploadPath(config.get('imports.tempDirectory')), filename));
                if (!isEmpty(metadata.playlistFilenames)) {
                    importFile.importMode = 'playlists';
                    switch (metadata.format) {
                        case 'json':
                            importFile.format = 'json';
                            for (let _filename of metadata.playlistFilenames) {
                                let entry = zip.getEntry(_filename);
                                let playlist = JSON.parse(entry.getData().toString("utf8"));
                                importFile.playlists.push(new ExportPlaylistDto(playlist));
                            }
                            if (selectedFilenames.indexOf(filename) > -1) {
                                // process this import
                                importFile.playlists.map((playlist: ExportPlaylistDto) => {
                                    this.playlistsService.create(new CreatePlaylistDto(playlist));
                                });
                                rmSync(join(getAbsoluteUploadPath(config.get('imports.tempDirectory')), filename));
                            } else {
                                importFiles.push(importFile);
                            }
                            break;
                        case 'text':
                            importFile.format = 'text';
                            for (let _filename of metadata.playlistFilenames) {
                                let entry = zip.getEntry(_filename);
                                let entryContent = entry.getData().toString("utf8");
                                let exportPlaylistDto = new ExportPlaylistDto();
                                exportPlaylistDto.parsePlainText(entryContent);
                                let songsEntryPath = entry.name.substring(0, entry.name.length - ('.txt'.length)) + '_songs';
                                zip.getEntries().filter((songEntry: IZipEntry) => songEntry.entryName.startsWith(songsEntryPath) && !isEmpty(songEntry.name)).map((songEntry: IZipEntry) => {
                                    let songEntryContent = songEntry.getData().toString("utf8");
                                    let exportSongDto = new ExportSongDto();
                                    exportSongDto.parsePlainText(songEntryContent);
                                    exportPlaylistDto.songs.push(exportSongDto);
                                });
                                importFile.playlists.push(exportPlaylistDto);
                            }
                            if (selectedFilenames.indexOf(filename) > -1) {
                                // process this import
                                importFile.playlists.map((playlist: ExportPlaylistDto) => {
                                    this.playlistsService.create(new CreatePlaylistDto(playlist));
                                });
                                rmSync(join(getAbsoluteUploadPath(config.get('imports.tempDirectory')), filename));
                            } else {
                                importFiles.push(importFile);
                            }
                            break;
                    }
                } else {
                    importFile.importMode = 'songs';

                    switch (metadata.format) {
                        case 'json':
                            importFile.format = 'json';
                            for (let _filename of metadata.songFilenames) {
                                let entry = zip.getEntry(_filename);
                                let songs = JSON.parse(entry.getData().toString("utf8"));
                                songs.map((song: Song) => {
                                    importFile.songs.push(new ExportSongDto(song as SongDto));
                                });
                            }
                            if (selectedFilenames.indexOf(filename) > -1) {
                                // process this import
                                importFile.songs.map((song: ExportSongDto) => {
                                    this.songsService.create(new CreateSongDto(song));
                                });
                                rmSync(join(getAbsoluteUploadPath(config.get('imports.tempDirectory')), filename));
                            } else {
                                importFiles.push(importFile);
                            }
                            break;
                        case 'text':
                            importFile.format = 'text';
                            for (let _filename of metadata.songFilenames) {
                                let entry = zip.getEntry(_filename);
                                let entryContent = entry.getData().toString("utf8");
                                let exportSongDto = new ExportSongDto();
                                exportSongDto.parsePlainText(entryContent);
                                importFile.songs.push(exportSongDto);
                            }
                            if (selectedFilenames.indexOf(filename) > -1) {
                                // process this import
                                importFile.songs.map((song: ExportSongDto) => {
                                    this.songsService.create(new CreateSongDto(song));
                                });
                                rmSync(join(getAbsoluteUploadPath(config.get('imports.tempDirectory')), filename));
                            } else {
                                importFiles.push(importFile);
                            }
                            break;
                    }
                }
            } catch (error) {
                if (!isEmpty(selectedFilenames)) {
                    this.logger.fatal('could not process a selected import', { selectedFilenames, error });
                }else{
                    this.logger.fatal('could not parse a file import', { selectedFilenames, error });
                }
                continue;
            }
        }

        return importFiles;

    }

}
