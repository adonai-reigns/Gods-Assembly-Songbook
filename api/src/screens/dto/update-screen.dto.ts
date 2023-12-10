import { IsString, IsOptional, IsObject } from 'class-validator';
import { ScreenStyle } from '../screen.entity';

export class UpdateScreenDto {
    @IsOptional()
    @IsString()
    readonly name: string;

    @IsOptional()
    @IsObject()
    readonly style: ScreenStyle;

}
