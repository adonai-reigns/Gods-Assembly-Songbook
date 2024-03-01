import { IsString, IsOptional } from 'class-validator';
import { CreateSongDto } from 'src/songs/dto/create-song.dto';

export class CreatePlaylistDto {
    @IsString()
    @IsOptional()
    readonly name: string = '';

    @IsString()
    @IsOptional()
    readonly startSlide: string = '';

    @IsString()
    @IsOptional()
    readonly endSlide: string = '';

    @IsString()
    @IsOptional()
    readonly pauseSlide: string = '';

    @IsOptional()
    readonly songs: CreateSongDto[] = [];

    @IsOptional()
    readonly createdAt: Date;

    constructor(playlist?: CreatePlaylistDto) {
        if (playlist) {
            this.name = playlist.name;
            this.startSlide = playlist.startSlide;
            this.pauseSlide = playlist.pauseSlide;
            this.endSlide = playlist.endSlide;
            if(playlist.createdAt){
                this.createdAt = playlist.createdAt;
            }
            if(playlist.songs){
                this.songs = playlist.songs.map((song: CreateSongDto) => new CreateSongDto(song));
            }
        }
    }

}
