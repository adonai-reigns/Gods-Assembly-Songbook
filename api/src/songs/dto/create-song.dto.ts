import { Length, IsString, IsNumber, IsOptional } from 'class-validator';
import { Playlist } from 'src/playlists/playlist.entity';
import { SongCopyright } from '../songCopyright.entity';

export class CreateSongDto {
    @IsString()
    @Length(3, 60)
    readonly name: string;

    @IsNumber()
    readonly sorting: number;

    @IsOptional()
    @IsNumber()
    songTemplateId: number | null;

    @IsOptional()
    readonly playlists: Playlist[];

    @IsOptional()
    readonly copyright: SongCopyright;

}