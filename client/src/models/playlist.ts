import type Song from "./song";

export class Playlist {
    id: number = 0;
    name: string = '';
    startSlide: string = '';
    endSlide: string = '';
    pauseSlide: string = '';
    songs: Song[] = [];
    createdAt?: Date;
    updatedAt?: Date;
}

export class PlaylistSong {
    playlistId: number = 0;
    songId: number = 0;
}
