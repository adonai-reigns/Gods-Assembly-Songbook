import { Length, IsString, IsNumber, IsOptional } from 'class-validator';
import { merge } from 'lodash';

import { Playlist } from 'src/playlists/playlist.entity';
import { CreateSlideDto } from 'src/slides/dto/create-slide.dto';

export class CreateSongCopyrightDto {
    id?: number;

    @IsString()
    @IsOptional()
    description?: string = '';

    @IsString()
    @IsOptional()
    author?: string = '';

    @IsString()
    @IsOptional()
    publisher?: string = '';

    @IsString()
    @IsOptional()
    year?: string = '';

    @IsString()
    @IsOptional()
    url?: string = '';

}

export class CreateSongDto {
    @IsNumber()
    @IsOptional()
    readonly id?: number;

    @IsString()
    @Length(3, 60)
    readonly name: string;

    @IsNumber()
    @IsOptional()
    readonly sorting?: number = 0;

    @IsOptional()
    @IsNumber()
    songTemplateId?: number | null = null;

    @IsOptional()
    readonly playlists?: Playlist[] = [];

    @IsOptional()
    readonly copyright?: CreateSongCopyrightDto = new CreateSongCopyrightDto();

    @IsOptional()
    readonly slides?: CreateSlideDto[] = [];

    @IsOptional()
    readonly createdAt?: Date;

    @IsOptional()
    readonly updatedAt?: Date;

    constructor(song?: CreateSongDto) {
        if (song) {
            this.name = song.name;
            this.copyright = merge(this.copyright, song.copyright);
            if(song.slides){
                this.slides = song.slides.map((slide: CreateSlideDto) => new CreateSlideDto(slide));
            }
        }
    }

}
