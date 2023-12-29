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
    gif = 'gif'
}

export enum AllowedMimeTypes {
    png = 'image/png',
    jpg = 'image/jpg',
    jpeg = 'image/jpeg',
    gif = 'image/gif',
}

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
