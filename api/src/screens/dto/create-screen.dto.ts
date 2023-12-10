import { IsString, IsOptional, IsObject } from 'class-validator';
import { ScreenStyle } from '../screen.entity';

export class CreateScreenDto {
    @IsString()
    @IsOptional()
    readonly name: string;

    @IsObject()
    @IsOptional()
    readonly style: ScreenStyle;
}
