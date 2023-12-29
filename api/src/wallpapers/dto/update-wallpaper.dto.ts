import { IsString, IsOptional, IsObject, IsArray } from 'class-validator';

import { WallpaperStyle } from '../wallpaper.entity';

import { FileDto } from './create-wallpaper.dto';

export class UpdateWallpaperDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsObject()
    @IsOptional()
    readonly style: WallpaperStyle;

    @IsString()
    @IsOptional()
    format: string;

    @IsString()
    @IsOptional()
    role: string;

    @IsOptional()
    @IsArray()
    files: FileDto[];

}
