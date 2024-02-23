import { get } from 'lodash';
import { File } from './file';

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

export const slideshowAnimationIns = [
    {
        code: 'fadeIn',
        title: 'Fade In'
    },
    {
        code: 'bounceIn',
        title: 'Bounce In'
    },
    {
        code: 'zoomIn',
        title: 'Zoom In'
    }
];

export const slideshowAnimationOuts = [
    {
        code: 'fadeOut',
        title: 'Fade Out'
    },
    {
        code: 'bounceOut',
        title: 'Bounce Out'
    },
    {
        code: 'zoomOut',
        title: 'Zoom Out'
    }
];

export const slideshowAnimationSpeeds = [
    {
        code: 'slower',
        title: 'Slower'
    },
    {
        code: 'slow',
        title: 'Slow'
    },
    {
        code: 'normal',
        title: 'Normal'
    },
    {
        code: 'fast',
        title: 'Fast'
    },
    {
        code: 'faster',
        title: 'Faster'
    }
];

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
    slideshowAnimationIn: string = 'fadeIn';
    slideshowAnimationOut: string = 'fadeOut';
    slideshowAnimationSpeed: string = 'normal';
}

export class SlideLineStyle {
    tagname: string = 'p';
    padding: string = '1rem';
    margin: string = '1rem';
    color: string = 'white';
    backgroundColor: string = 'rgba(0, 0, 0, 0.4)';
}

export class WallpaperFile extends File {
    slideLineStyle: SlideLineStyle = new SlideLineStyle();
}

export class Wallpaper {
    id: number = 0;
    name: string = '';
    format: string = '';
    role: string = '';
    files: WallpaperFile[] = [];
    style: WallpaperStyle = new WallpaperStyle();
}
