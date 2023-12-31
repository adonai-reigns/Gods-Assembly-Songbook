import { Optional } from 'sequelize';
import { Table, Column, Model, DataType } from 'sequelize-typescript';

import { FileDto } from './dto/create-wallpaper.dto';

export enum Role {
    assembly = 'assembly',
    // playlist = 'playlist',
    // song = 'song',
    // slide = 'slide'
}

export enum BackgroundSize {
    center = 'center',
    stretch = 'stretch',
    cover = 'cover',
    contain = 'contain',
    tile = 'tile',
}

export enum Format {
    png = 'png',
    jpg = 'jpg',
    gif = 'gif'
}

export enum MimeType {
    png = 'image/png',
    jpg = 'image/jpeg',
    gif = 'image/gif'
}

export class WallpaperStyle {
    backgroundSize: BackgroundSize = BackgroundSize.center;
    slideshowSpeed: number = 5;
}

interface wallpaperAttributes {
    id: number;
    name: string;
    format: string;
    role: string;
    files: string;
    style: string;
}

interface wallpaperCreationAttributes extends Optional<wallpaperAttributes, 'id'> { }

@Table({ tableName: "wallpaper" })
export class Wallpaper extends Model<wallpaperAttributes, wallpaperCreationAttributes> {
    
    @Column({ primaryKey: true })
    id: number;

    @Column
    name: string;

    @Column
    format: string;

    @Column
    role: string;

    @Column(DataType.TEXT)
    get files(): FileDto[] {
        const dataValue = this.getDataValue('files');
        if (typeof dataValue === 'string') {
            return JSON.parse(dataValue);
        } else {
            return [];
        }
    }

    set files(value: FileDto[]) {
        this.setDataValue('files', JSON.stringify(value ?? []));
    }

    @Column(DataType.TEXT)
    get style(): WallpaperStyle {
        return JSON.parse(this.getDataValue('style') ?? '{}');
    }

    set style(value: WallpaperStyle) {
        this.setDataValue('style', JSON.stringify(value));
    }

}

/**
 * Default wallpapers that are installed when database is created
 */
export const SystemWallpapers = [
    {
        id: 1,
        role: Role.assembly,
        name: 'God\'s Assembly',
        files: [],
        style: new WallpaperStyle()
    }
];
