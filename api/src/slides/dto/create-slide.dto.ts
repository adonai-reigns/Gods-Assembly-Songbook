import { IsString, IsNumber, IsOptional } from 'class-validator';
import { SlideType } from '../slide.entity';

export class CreateSlideDto {
    @IsString()
    @IsOptional()
    readonly name: string;

    @IsString()
    readonly type: SlideType;

    @IsString()
    @IsOptional()
    readonly content: string;

    @IsNumber()
    readonly songId: number;

    @IsNumber()
    @IsOptional()
    readonly sorting: number;
}
