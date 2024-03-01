import {
    Controller,
    Get,
    Post,
    Put,
    Patch,
    Delete,
    Param,
    Body,
    UseInterceptors,
    UploadedFiles,
    ParseFilePipe,
    MaxFileSizeValidator,
    FileTypeValidator,
    Res,
    StreamableFile,
    NotFoundException,
    BadRequestException
} from '@nestjs/common';

import { Response } from 'express';
import { diskStorage } from 'multer';
import { FilesInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { resolve } from 'path';
import { createReadStream, existsSync } from 'fs';

import * as config from 'config';

import { CreateWallpaperDto, SlideLineStyleDto, WallpaperFileDto, defaultSlideLineStyle } from './dto/create-wallpaper.dto';
import { UpdateWallpaperDto } from './dto/update-wallpaper.dto';

import { Wallpaper, MimeType } from './wallpaper.entity';
import { WallpapersService } from './wallpapers.service';
import { getAbsoluteUploadPath } from '../app.service';

const validWallpaperTypesRegexp = new RegExp('.(' + (config.get('fileUploads.wallpapers.validTypes') as Array<string>).join('|') + ')$');

@Controller('wallpapers')
export class WallpapersController {

    constructor(
        private readonly wallpapersService: WallpapersService
    ) { }

    @Get()
    findAll(): Promise<Wallpaper[]> {
        return this.wallpapersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Wallpaper> {
        return this.wallpapersService.findOne(id);
    }

    @Post()
    async create(@Body() createWallpaperDto: CreateWallpaperDto): Promise<Wallpaper> {
        if (createWallpaperDto.id === 0) {
            // let generated id be auto-incremented
            return this.wallpapersService.create({ ...createWallpaperDto, ...{ id: undefined } });
        } else {
            return this.wallpapersService.create(createWallpaperDto);
        }
    }

    @Post('uploadWallpaper')
    @UseInterceptors(FilesInterceptor('files[]', config.get('fileUploads.wallpapers.maxParallelUploadCount'), {
        storage: diskStorage({
            destination: getAbsoluteUploadPath(config.get('fileUploads.wallpapers.storageDirectory')),
            filename: (req, file, callback) => {
                const uuid = randomUUID();
                const ext = file.originalname.split('.').pop();
                callback(null, `${uuid}.${ext}`);
            },
        }),
        fileFilter(req, file, callback) {
            let isValid = true;
            if ([...Object.values(MimeType).map((v: string) => v)].indexOf(file.mimetype) < 0) {
                isValid = false;
            }
            callback(null, isValid);
        },
        limits: {
            fileSize: (1024 * 1024 * (Math.round(config.get('fileUploads.wallpapers.maxFileSizeMB'))))
        }
    }))
    async uploadWallpaper(
        @UploadedFiles(
            new ParseFilePipe(
                {
                    validators: [
                        new MaxFileSizeValidator({ maxSize: (1024 * 1024 * (Math.round(config.get('fileUploads.wallpapers.maxFileSizeMB')))) }),
                        new FileTypeValidator({ fileType: validWallpaperTypesRegexp }),
                    ],
                    exceptionFactory: (errorMessage) => {
                        if (errorMessage.match(/expected type/i)) {
                            let exts = config.get('fileUploads.wallpapers.validTypes') as Array<string>;
                            return new BadRequestException(`Valid file types are ${exts.slice(0, -1).join(', ')} or ${exts.slice(-1)}`);
                        } else {
                            return new BadRequestException(errorMessage);
                        }
                    },
                }
            )
        )
        files: Express.Multer.File[],
        @Body('wallpaperId') wallpaperId: number,
    ) {
        const wallpaper = await this.wallpapersService.findOne(wallpaperId);

        if (!wallpaper) {
            throw new BadRequestException("Invalid wallpaperId");
        }

        const response = [];

        let wallpaperFiles = wallpaper.files;

        files.forEach(file => {

            const fileResponse = {
                originalname: file.originalname,
                filename: file.filename
            };

            response.push(fileResponse);

            wallpaperFiles.push({
                originalname: file.originalname,
                mimetype: file.mimetype,
                filename: file.filename,
                filepath: file.path,
                size: file.size,
                createdAt: new Date(),
                slideLineStyle: defaultSlideLineStyle as SlideLineStyleDto
            } as WallpaperFileDto);

        });

        wallpaper.files = wallpaperFiles;

        return this.wallpapersService.update(wallpaperId, wallpaper);

    }

    @Patch(':id')
    async update(@Param('id') id: number, @Body() wallpaper: UpdateWallpaperDto): Promise<Wallpaper> {
        return this.wallpapersService.update(id, wallpaper);
    }

    @Put(':id')
    async replace(@Param('id') id: number, @Body() wallpaper: CreateWallpaperDto): Promise<Wallpaper> {
        return this.wallpapersService.update(id, wallpaper);
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        await this.wallpapersService.delete(id);
    }

    @Delete('deleteFile/:wallpaperId/:filename')
    async deleteFile(@Param('wallpaperId') wallpaperId: number, @Param('filename') filename: string) {
        await this.wallpapersService.deleteFile(wallpaperId, filename);
    }

    @Patch('setFiles/:wallpaperId')
    async setSorting(@Param('wallpaperId') wallpaperId: number, @Body('files') files: WallpaperFileDto[]) {
        let sortedFileIds = files.map((file: WallpaperFileDto) => file.filename);
        let wallpaper = await this.wallpapersService.findOne(wallpaperId);
        let wallpaperFiles = wallpaper.files.sort((fileA: WallpaperFileDto, fileB: WallpaperFileDto): number => {
            let indexA = sortedFileIds.indexOf(fileA.filename);
            let indexB = sortedFileIds.indexOf(fileB.filename);
            return (indexA > indexB) ? 1 : -1;
        });
        wallpaper.files = wallpaperFiles.map((_wallpaperFile: WallpaperFileDto) => {
            let newFile = files.filter((_file: WallpaperFileDto) => _file.filename === _wallpaperFile.filename)[0] ?? undefined;
            if (newFile) {
                _wallpaperFile.slideLineStyle = newFile.slideLineStyle;
            }
            return _wallpaperFile;
        });
        return this.wallpapersService.update(wallpaperId, wallpaper);
    }

    @Get('file/:wallpaperId/:filename')
    async readFile(@Param('wallpaperId') wallpaperId: number, @Param('filename') filename: string, @Res({ passthrough: true }) response: Response) {

        const wallpaper = await this.wallpapersService.findOne(wallpaperId);
        const file = wallpaper.files.filter((_file: WallpaperFileDto) => _file.filename === filename)[0] ?? undefined;
        const filepath = file ? file.filepath : '';

        let resolvedFilepath = resolve(filepath);

        if (!file || !existsSync(resolvedFilepath)) {
            throw new NotFoundException('The file cannot be found');
        } else {

            if ((Object.values(MimeType) as string[]).indexOf(file.mimetype) > -1) {
                response.contentType(file.mimetype);

                response.set({
                    'Content-Disposition': 'inline; filename="' + file.filename + '"',
                    'Cache-Control': 'no-cache',
                    'Mime-Type': file.mimetype
                });

                const fileStream = createReadStream(resolvedFilepath);

                return new StreamableFile(fileStream).setErrorHandler((error: any) => {
                    error && console.log('there was an error from the StreamableFile ' + file.filename + ' (' + file.mimetype + '): ', error.message);
                });

            } else {
                throw new BadRequestException('Unsupported File Type: ' + file.mimetype);
            }

        }

    }

}
