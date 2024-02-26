import { get, has, set } from 'lodash';

export enum SlideType {
    Intro = 'Intro',
    Verse = 'Verse',
    PreChorus = 'PreChorus',
    Chorus = 'Chorus',
    PostChorus = 'PostChorus',
    Bridge = 'Bridge',
    Outro = 'Outro',
    Hook = 'Hook'
}

export const SlideTypeShortNames: { [key: string]: string } = {
    [SlideType.Intro]: 'In',
    [SlideType.Verse]: 'V',
    [SlideType.PreChorus]: '➔Ch',
    [SlideType.Chorus]: 'Ch',
    [SlideType.PostChorus]: 'Ch➔',
    [SlideType.Bridge]: 'Br',
    [SlideType.Outro]: 'Out'
}

export const SlideTypeClassNames: { [key: string]: string } = {
    [SlideType.Intro]: 'bg-teal-400 ',
    [SlideType.Verse]: 'bg-cyan-500 ',
    [SlideType.PreChorus]: 'bg-teal-400 ',
    [SlideType.Chorus]: 'bg-orange-500 ',
    [SlideType.PostChorus]: 'bg-teal-400 ',
    [SlideType.Bridge]: 'bg-red-400 ',
    [SlideType.Outro]: 'bg-teal-400 '
}

export const defaultSlideType = SlideType.Verse;

export const SlideTypeLabels: { [key: string]: string } = {
    Intro: 'Intro',
    Verse: 'Verse',
    PreChorus: 'Pre-Chorus',
    Chorus: 'Chorus',
    PostChorus: 'Post-Chorus',
    Bridge: 'Bridge',
    Outro: 'Outro',
    Hook: 'Hook'
}

interface ISlide {
    id?: number;
    type?: SlideType;
    name?: string;
    content?: string;
    songId?: number;
    sorting?: number;
    duration?: number;
}

export class Slide {
    id: number = 0;
    type: SlideType = SlideType.Verse;
    name: string = '';
    content: string = '';
    songId: number = 0;
    sorting: number = 0;
    duration: number = 0;
    constructor(args: ISlide) {
        Object.keys(this).map((keyname: string) => (has(args, keyname) && set(this, keyname, get(args, keyname))));
    }
}

