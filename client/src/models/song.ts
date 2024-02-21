import { get, set } from 'lodash';

import Slide from './slide';

interface ISong {
    id?: number;
    name?: string;
    sorting?: number;
    slides?: Slide[];
}

export default class Song {
    id?: number;
    name: string = '';
    sorting: number = 0;
    slides: Slide[] = [];
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
