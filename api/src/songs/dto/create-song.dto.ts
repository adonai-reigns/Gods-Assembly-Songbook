import { Length, IsString, IsNumber } from 'class-validator';

export class CreateSongDto {
    @IsString()
    @Length(3, 60)
    readonly name: string;

    @IsNumber()
    readonly sorting: number;
}