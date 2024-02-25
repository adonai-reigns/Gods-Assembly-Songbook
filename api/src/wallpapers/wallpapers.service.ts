import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { unlinkSync } from 'fs';

import { CreateWallpaperDto, WallpaperFileDto } from './dto/create-wallpaper.dto';
import { UpdateWallpaperDto } from './dto/update-wallpaper.dto';

import { Wallpaper } from './wallpaper.entity';

@Injectable()
export class WallpapersService {

    constructor(@Inject('WallpapersRepository') private readonly wallpapersRepository: typeof Wallpaper) { }

    async findAll(): Promise<Wallpaper[]> {
        return await this.wallpapersRepository.findAll<Wallpaper>();
    }

    async findOne(id: number): Promise<Wallpaper> {
        const wallpaper = await this.wallpapersRepository.findByPk<Wallpaper>(id);
        if (!wallpaper) {
            throw new HttpException('No wallpaper found', HttpStatus.NOT_FOUND);
        }
        return wallpaper;
    }

    async create(createWallpaperDto: CreateWallpaperDto): Promise<Wallpaper> {
        const wallpaper = new Wallpaper();
        wallpaper.id = createWallpaperDto.id ?? null;
        wallpaper.name = createWallpaperDto.name;
        wallpaper.role = createWallpaperDto.role;
        wallpaper.style = createWallpaperDto.style;
        wallpaper.files = [];
        return wallpaper.save();
    }

    async update(id: number, updateWallpaperDto: UpdateWallpaperDto): Promise<Wallpaper> {
        const wallpaper = await this.findOne(id);
        wallpaper.name = updateWallpaperDto.name || wallpaper.name;
        wallpaper.role = updateWallpaperDto.role || wallpaper.role;
        wallpaper.files = updateWallpaperDto.files || wallpaper.files;
        wallpaper.style = updateWallpaperDto.style || wallpaper.style;
        return wallpaper.save();
    }

    async delete(id: number) {
        const wallpaper = await this.findOne(id) as Wallpaper;
        await wallpaper.destroy();
    }

    async deleteFile(wallpaperId: number, filename: string) {
        const wallpaper = await this.findOne(wallpaperId) as Wallpaper;
        const fileToDelete = wallpaper.files.filter((file: WallpaperFileDto) => file.filename === filename)[0];
        if(fileToDelete){
            try{
                unlinkSync(fileToDelete.filepath);
            }catch(e){
                // could not delete the file from the filesystem
            }
        }
        wallpaper.files = wallpaper.files.filter((file: WallpaperFileDto) => file.filename !== filename);
        return wallpaper.save();
    }

}
