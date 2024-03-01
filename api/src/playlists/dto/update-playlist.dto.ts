import { IsString, IsOptional } from 'class-validator';
import { SongDto } from 'src/songs/dto/song.dto';

export class UpdatePlaylistDto {
    @IsOptional()
    @IsString()
    readonly name: string;

    @IsOptional()
    @IsString()
    readonly startSlide: string;

    @IsOptional()
    @IsString()
    readonly endSlide: string;

    @IsOptional()
    @IsString()
    readonly pauseSlide: string;

    @IsOptional()
    readonly songs: SongDto[];

}
