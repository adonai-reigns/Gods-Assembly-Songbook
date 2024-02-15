import { get } from 'lodash';

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
    tile = 'tile'
}

export enum Format {
    png = 'png',
    jpg = 'jpg',
    jpeg = 'jpg',
    gif = 'gif',
    webp = 'webp',
    mkv = 'mkv',
    mp4 = 'mp4',
    mpeg = 'mp4',
    ogg = 'ogg',
    ogx = 'ogx',
    webm = 'webm'
}

export enum MimeType {
    png = 'image/png',
    jpg = 'image/jpg',
    jpeg = 'image/jpeg',
    gif = 'image/gif',
    webp = 'image/webp',
    mkv = 'video/x-matroska',
    mp4 = 'video/mp4',
    mpeg = 'video/mpeg',
    ogg = 'video/ogg',
    ogx = 'application/ogg',
    webm = 'video/webm'
}

export const getMimeTypeFormat = (mimeType: MimeType): Format | void => {
    for (let keyname of Object.keys(MimeType)) {
        if (get(MimeType, keyname) === mimeType) {
            return get(Format, keyname);
        }
    }
};

export class WallpaperStyle {
    backgroundSize: BackgroundSize = BackgroundSize.center;
    slideshowSpeed: number = 5;
}

export class File {
    id: number = 0;
    originalname: string = '';
    mimetype: string = '';
    filename: string = '';
    filepath: string = '';
    size: number = 0;
    createdAt: Date = new Date();
}

export class Wallpaper {
    id: number = 0;
    name: string = '';
    format: string = '';
    role: string = '';
    files: File[] = [];
    style: WallpaperStyle = new WallpaperStyle();
}
