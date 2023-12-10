import { Slide, SlideType, defaultSlideType } from '../slide.entity';

export class SlideDto {
    readonly id: number;
    readonly type: SlideType;
    readonly name: string;
    readonly content: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;

    constructor(slide: Slide) {
        this.id = slide.id;
        this.type = defaultSlideType;
        this.name = slide.name;
        this.content = slide.content;
        this.createdAt = slide.createdAt;
        this.updatedAt = slide.updatedAt;
    }
}
