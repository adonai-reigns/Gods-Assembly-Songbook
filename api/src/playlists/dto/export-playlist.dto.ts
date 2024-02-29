import { Song } from 'src/songs/song.entity';
import { Playlist } from '../playlist.entity';

import { ExportSongDto } from 'src/songs/dto/export-song.dto';

export class ExportPlaylistDto {
    readonly name: string;
    readonly startSlide: string;
    readonly endSlide: string;
    readonly pauseSlide: string;
    readonly songs: ExportSongDto[];
    readonly createdAt: Date;
    readonly updatedAt: Date;
    constructor(playlist: Playlist) {
        this.name = playlist.name;
        this.startSlide = playlist.startSlide;
        this.pauseSlide = playlist.pauseSlide;
        this.endSlide = playlist.endSlide;
        this.songs = playlist.songs.map((song: Song) => new ExportSongDto(song));
        this.createdAt = playlist.createdAt;
        this.updatedAt = playlist.updatedAt;
    }
}
