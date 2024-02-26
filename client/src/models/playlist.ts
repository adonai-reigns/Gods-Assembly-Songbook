import { get, set } from 'lodash';

import { Song } from './song';

export interface IPlaylist {
    id?: number;
    name?: string;
    startSlide?: string;
    endSlide?: string;
    pauseSlide?: string;
    songs?: Song[];
    createdAt?: Date;
    updatedAt?: Date;
}

export class Playlist {
    id: number = 0;
    name: string = '';
    startSlide: string = '';
    endSlide: string = '';
    pauseSlide: string = '';
    songs: Song[] = [];
    createdAt?: Date;
    updatedAt?: Date;
    constructor(args: IPlaylist) {
        Object.keys(this).map((keyname: string) => {
            if (keyname === 'songs') {
                set(this, keyname, get(args, keyname)?.map((songData: any) => new Song(songData)));
            } else {
                set(this, keyname, get(args, keyname));
            }
        });
    }
}

export class PlaylistSong {
    playlistId: number = 0;
    songId: number = 0;
}
