import { Length, IsString, IsNumber, IsOptional } from 'class-validator';
import { Playlist } from 'src/playlists/playlist.entity';
import { SongCopyright } from '../songCopyright.entity';
import { SlideDto } from 'src/slides/dto/slide.dto';

export class UpdateSongDto {
    @IsOptional()
    @IsNumber()
    readonly id?: number;

    @IsOptional()
    @IsString()
    @Length(3, 60)
    readonly name: string;

    @IsOptional()
    @IsNumber()
    readonly sorting?: number = 0;

    @IsOptional()
    readonly songTemplateId?: number | null;

    @IsOptional()
    readonly playlists: Playlist[];

    @IsOptional()
    readonly copyright: SongCopyright;

    @IsOptional()
    readonly slides?: SlideDto[];  

}
