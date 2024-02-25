import { Slide } from 'src/slides/slide.entity';
import { Song } from '../song.entity';
import { Playlist } from 'src/playlists/playlist.entity';

export class SongDto {
    readonly id: number;
    readonly name: string;
    readonly sorting: number;
    readonly songTemplateId: number | null;
    readonly playlists: Playlist[];
    readonly slides: Slide[];
    readonly createdAt: Date;
    readonly updatedAt: Date;

    constructor(song: Song) {
        this.id = song.id;
        this.name = song.name;
        this.sorting = song.sorting;
        this.songTemplateId = null;
        this.slides = song.slides;
        this.playlists = song.playlists;
        this.createdAt = song.createdAt;
        this.updatedAt = song.updatedAt;
    }
}