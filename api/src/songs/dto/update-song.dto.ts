import { Length, IsString, IsNumber, IsOptional } from 'class-validator';
import { Playlist } from 'src/playlists/playlist.entity';
import { SongCopyright } from '../songCopyright.entity';

export class UpdateSongDto {
    @IsOptional()
    @IsString()
    @Length(3, 60)
    readonly name: string;

    @IsOptional()
    @IsNumber()
    readonly sorting: number;

    @IsOptional()
    readonly playlists: Playlist[];

    @IsOptional()
    readonly copyright: SongCopyright;

}