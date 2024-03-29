import { get, set } from 'lodash';

import { Slide } from './slide';

interface ISong {
    id?: number;
    name?: string;
    sorting?: number;
    songTemplate?: Song | null;
    slides?: Slide[];
}

export class SongCopyright {
    description?: string = '';
    author?: string = '';
    publisher?: string = '';
    year?: string = '';
    url?: string = '';
}

export class Song {
    id?: number;
    name: string = '';
    sorting: number = 0;
    slides: Slide[] = [];
    songTemplate: Song | null = null;
    copyright: SongCopyright = new SongCopyright();
    constructor(args: ISong) {
        Object.keys(this).map((keyname: string) => {
            if (keyname === 'slides') {
                set(this, keyname, get(args, keyname)?.map((slideData: any) => new Slide(slideData)));
            } else {
                set(this, keyname, get(args, keyname));
            }
        });
    }
}
