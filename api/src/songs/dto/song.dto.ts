import { Slide } from 'src/slides/slide.entity';
import { Song } from '../song.entity';
import { Playlist } from 'src/playlists/playlist.entity';
import { CreateSongCopyrightDto } from './create-song.dto';

export class SongDto {
    readonly id: number;
    readonly name: string;
    readonly sorting: number;
    readonly songTemplateId: number | null;
    readonly playlists: Playlist[];
    readonly copyright: CreateSongCopyrightDto;
    readonly slides: Slide[];
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly songCopyrightId?: number;

    constructor(song: Song) {
        this.id = song.id;
        this.name = song.name;
        this.sorting = song.sorting;
        this.songTemplateId = null;
        this.slides = song.slides;
        this.playlists = song.playlists;
        this.copyright = song.copyright;
        this.createdAt = song.createdAt;
        this.updatedAt = song.updatedAt;
    }
}