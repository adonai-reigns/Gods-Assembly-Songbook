import { IsString, IsOptional } from 'class-validator';
import { Song } from 'src/songs/song.entity';


export class CreatePlaylistDto {
    @IsString()
    @IsOptional()
    readonly name: string;

    @IsString()
    @IsOptional()
    readonly startSlide: string;
    
    @IsString()
    @IsOptional()
    readonly endSlide: string;
    
    @IsString()
    @IsOptional()
    readonly pauseSlide: string;

    @IsOptional()
    readonly songs: Song[];
}
