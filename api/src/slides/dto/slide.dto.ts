import { Slide, SlideType, defaultSlideType } from '../slide.entity';

export class SlideDto {
    readonly id: number;
    readonly type: SlideType;
    readonly name: string;
    readonly content: string;
    readonly sorting: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;

    constructor(slide: Slide) {
        this.id = slide.id;
        this.type = defaultSlideType;
        this.name = slide.name;
        this.content = slide.content;
        this.sorting = slide.sorting;
        this.createdAt = slide.createdAt;
        this.updatedAt = slide.updatedAt;
    }
}
