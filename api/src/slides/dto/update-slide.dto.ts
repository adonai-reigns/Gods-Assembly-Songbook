import { IsString, IsNumber, IsOptional } from 'class-validator';
import { SlideType } from '../slide.entity';

export class UpdateSlideDto {
    @IsOptional()
    @IsString()
    readonly name: string;

    @IsOptional()
    @IsString()
    readonly type: SlideType;

    @IsOptional()
    @IsString()
    readonly content: string;

    @IsOptional()
    @IsNumber()
    readonly sorting?: number;

}
