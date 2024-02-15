import { IsString, IsOptional, IsObject, IsNotEmpty, IsNumber, IsDate } from 'class-validator';

import { WallpaperStyle } from '../wallpaper.entity';

export class FileDto {

    @IsNotEmpty()
    @IsString()
    originalname: string;

    @IsNotEmpty()
    @IsString()
    mimetype: string;

    @IsNotEmpty()
    @IsString()
    filename: string;

    @IsNotEmpty()
    @IsString()
    filepath: string;

    @IsNotEmpty()
    @IsNumber()
    size: number;

    @IsNotEmpty()
    @IsDate()
    createdAt: Date;

}

export class CreateWallpaperDto {
    @IsOptional()
    @IsNumber()
    id: number;

    @IsString()
    @IsOptional()
    readonly name: string;

    @IsString()
    @IsOptional()
    role: string;

    @IsOptional()
    files: FileDto[];

    @IsObject()
    @IsOptional()
    readonly style: WallpaperStyle;

}
