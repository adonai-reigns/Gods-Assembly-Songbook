import { IsString, IsOptional, IsObject, IsArray } from 'class-validator';

import { WallpaperStyle } from '../wallpaper.entity';

import { WallpaperFileDto } from './create-wallpaper.dto';

export class UpdateWallpaperDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsObject()
    @IsOptional()
    readonly style: WallpaperStyle;

    @IsString()
    @IsOptional()
    role: string;

    @IsOptional()
    @IsArray()
    files: WallpaperFileDto[];

}
