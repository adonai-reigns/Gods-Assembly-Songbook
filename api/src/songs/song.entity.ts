import { Table, Column, Model, HasMany, ForeignKey, BelongsToMany } from 'sequelize-typescript';

import { Slide } from '../slides/slide.entity';
import { Playlist, PlaylistSong } from 'src/playlists/playlist.entity';

@Table({ tableName: 'song' })
export class Song extends Model {
    @Column
    name: string;

    @Column
    sorting: number;

    @HasMany(() => Slide, { onDelete: 'CASCADE' })
    slides: Slide[];

    @BelongsToMany(() => Playlist, () => PlaylistSong)
    playlists: Playlist[];

}


