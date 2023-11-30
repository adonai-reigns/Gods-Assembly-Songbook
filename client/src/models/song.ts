import Slide from './slide';

export default class Song {
    id?: number;
    name: string = '';
    sorting: number = 0;
    slides: Slide[] = [];
}
