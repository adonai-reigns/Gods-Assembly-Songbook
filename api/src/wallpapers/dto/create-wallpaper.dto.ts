import { IsString, IsOptional, IsObject, IsNotEmpty, IsNumber, IsDate } from 'class-validator';

import { WallpaperStyle } from '../wallpaper.entity';

export class SlideLineStyleDto {
    @IsNotEmpty()
    @IsString()
    tagname: string;

    @IsNotEmpty()
    @IsString()
    padding: string;

    @IsNotEmpty()
    @IsString()
    margin: string;

    @IsNotEmpty()
    @IsString()
    color: string;

    @IsNotEmpty()
    @IsString()
    backgroundColor: string;
}

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

export const defaultSlideLineStyle = {
    tagname: 'p',
    padding: '0.5em 1em',
    margin: '0.5em 0',
    color: 'FFFFFF',
    backgroundColor: '00000099'
} as SlideLineStyleDto;

export class WallpaperFileDto extends FileDto {

    @IsObject()
    slideLineStyle: SlideLineStyleDto = defaultSlideLineStyle;
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
    files: WallpaperFileDto[];

    @IsObject()
    @IsOptional()
    readonly style: WallpaperStyle;

}
