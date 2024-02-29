import { Song } from '../song.entity';
import { Slide } from 'src/slides/slide.entity';

import { SongCopyright } from '../songCopyright.entity';

export class ExportSlidesDto {
    readonly type: string;
    readonly name: string;
    readonly content: string;
    constructor(slide: Slide) {
        this.type = slide.type;
        this.name = slide.name;
        this.content = slide.content;
    }
}

export class ExportSongCopyrightDto {
    readonly description?: string;
    readonly author?: string;
    readonly publisher?: string;
    readonly year?: string;
    readonly url?: string;
    constructor(songCopyright: SongCopyright) {
        this.description = songCopyright.description;
        this.author = songCopyright.author;
        this.publisher = songCopyright.publisher;
        this.year = songCopyright.year;
        this.url = songCopyright.url;
    }
}

export class ExportSongDto {
    readonly id: number;
    readonly name: string;
    readonly copyright: ExportSongCopyrightDto;
    readonly slides: ExportSlidesDto[];
    constructor(song: Song) {
        this.id = song.id;
        this.name = song.name;
        this.slides = song.slides.map((slide: Slide) => new ExportSlidesDto(slide));
        this.copyright = new ExportSongCopyrightDto(song.copyright);
    }
}