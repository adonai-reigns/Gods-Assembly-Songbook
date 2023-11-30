import { Slide } from 'src/slides/slide.entity';
import { Song } from '../song.entity';

export class SongDto {
    readonly id: number;
    readonly name: string;
    readonly sorting: number;
    readonly slides: Slide[];
    readonly createdAt: Date;
    readonly updatedAt: Date;

    constructor(song: Song) {
        this.id = song.id;
        this.name = song.name;
        this.sorting = song.sorting;
        this.slides = song.slides;
        this.createdAt = song.createdAt;
        this.updatedAt = song.updatedAt;
    }
}