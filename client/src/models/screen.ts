import { get, set } from "lodash";

export enum Size {
    extraSmall = 'extraSmall',
    small = 'small',
    normal = 'normal',
    big = 'big',
    huge = 'huge',
    jumbo = 'jumbo'
}

export enum LinePadding {
    extraSmall = 'extraSmall',
    small = 'small',
    normal = 'normal',
    big = 'big',
    huge = 'huge',
    jumbo = 'jumbo'
}

export enum LineMargin {
    extraSmall = 'extraSmall',
    small = 'small',
    normal = 'normal',
    big = 'big',
    huge = 'huge',
    jumbo = 'jumbo'
}

export enum TextAlign {
    left = 'left',
    center = 'center',
    right = 'right',
    justify = 'justify'
}

export const TextSizesUnits = {
    extraSmall: '1em',
    small: '1.2em',
    normal: '1.8em',
    big: '2.4em',
    huge: '3.2em',
    jumbo: '3.8em'
}

export const PaddingSizesUnits = {
    extraSmall: '0em',
    small: '0.8em',
    normal: '1.2em',
    big: '2.4em',
    huge: '3.2em',
    jumbo: '4.5em'
}

export const LinePaddingUnits = {
    extraSmall: '0 1rem',
    small: '0.5rem 1rem',
    normal: '1rem',
    big: '2rem 1rem',
    huge: '2.5rem 1rem',
    jumbo: '3rem 1rem'
}

export const LineMarginUnits = {
    extraSmall: '0 1rem',
    small: '0.5rem 1rem',
    normal: '1rem',
    big: '2rem 1rem',
    huge: '2.5rem 1rem',
    jumbo: '3rem 1rem'
}

interface IScreenStyle {
    fontSize?: Size;
    linePadding?: LinePadding;
    lineMargin?: LineMargin;
    padding?: Size;
    textAlign?: TextAlign;
    showSlideType?: boolean;
}

export class ScreenStyle {
    fontSize: Size = Size.normal;
    linePadding: LinePadding = LinePadding.normal;
    lineMargin: LineMargin = LineMargin.normal;
    padding: Size = Size.normal;
    textAlign: TextAlign = TextAlign.center;
    showSlideType: boolean = true;
    constructor(args: IScreenStyle) {
        Object.keys(args).map((keyname: string) => set(this, keyname, get(args, keyname)));
    }
}

export class ScreenStyleComputed {
    audienceSlide: any = {
        fontSize: '1em',
        linePadding: '0.5em 1em',
        lineMargin: '0.5em 1em',
        padding: '1em',
        textAlign: TextAlign.center
    };
    slideType: any = {
        display: 'none'
    }
}

export class Screen {
    id: number = 0;
    name: string = '';
    style: ScreenStyle = new ScreenStyle({});
}
