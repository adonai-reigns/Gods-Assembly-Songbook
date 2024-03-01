import { IsString, IsNumber, IsOptional } from 'class-validator';
import { SlideType } from '../slide.entity';

export class CreateSlideDto {
    @IsNumber()
    @IsOptional()
    id?: number;

    @IsString()
    @IsOptional()
    readonly name: string;

    @IsString()
    readonly type: SlideType;

    @IsString()
    @IsOptional()
    readonly content: string;

    @IsNumber()
    @IsOptional()
    songId?: number;

    @IsNumber()
    @IsOptional()
    readonly sorting?: number;

    createdAt?: Date;
    updatedAt?: Date;

    constructor(slide?: CreateSlideDto) {
        if (slide) {
            this.name = slide.name ?? this.name;
            this.type = slide.type ?? this.type;
            this.songId = slide.songId ?? this.songId;
            this.sorting = slide.sorting ?? this.sorting;
            this.content = slide.content ?? this.content;
        }
    }
}
