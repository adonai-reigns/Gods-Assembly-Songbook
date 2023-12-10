export enum Size {
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

export class ScreenStyle {
    fontSize: Size = Size.normal;
    padding: Size = Size.normal;
    textAlign: TextAlign = TextAlign.center;
    showSlideType: boolean = true;
}

export class ScreenStyleComputed {
    audienceSlide: any = {
        fontSize: '1em',
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
    style: ScreenStyle = new ScreenStyle();
}
