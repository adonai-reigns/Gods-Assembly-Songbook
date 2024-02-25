import { Optional } from 'sequelize';
import { Table, Column, Model, DataType, ForeignKey, BelongsToMany } from 'sequelize-typescript';
import { Song } from 'src/songs/song.entity';

interface playlistSongAttributes {
    id: number;
    playlistId: number;
    songId: number;
    sorting: number;
}

interface playlistSongCreationAttributes extends Optional<playlistSongAttributes, 'id'> { }

@Table({ tableName: "playlistSong" })
export class PlaylistSong extends Model<playlistSongAttributes, playlistSongCreationAttributes> {

    @ForeignKey(() => Playlist)
    @Column
    playlistId: number;

    @ForeignKey(() => Song)
    @Column
    songId: number;

    @Column
    sorting: number;
}

interface playlistAttributes {
    id: number;
    name: string;
    startSlide: string;
    endSlide: string;
    pauseSlide: string;
}

interface playlistCreationAttributes extends Optional<playlistAttributes, 'id'> { }

@Table({ tableName: "playlist" })
export class Playlist extends Model<playlistAttributes, playlistCreationAttributes> {

    @Column
    name: string;

    @Column(DataType.TEXT)
    startSlide: string;

    @Column(DataType.TEXT)
    endSlide: string;

    @Column(DataType.TEXT)
    pauseSlide: string;

    @BelongsToMany(() => Song, () => PlaylistSong)
    songs: Song[];

}
