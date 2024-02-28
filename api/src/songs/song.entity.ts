import { Table, Column, Model, HasMany, BelongsToMany, ForeignKey, BelongsTo } from 'sequelize-typescript';

import { Slide } from '../slides/slide.entity';
import { Playlist, PlaylistSong } from 'src/playlists/playlist.entity';

import { IsOptional } from 'class-validator';
import { Optional } from 'sequelize';
import { SongCopyright } from './songCopyright.entity';

interface songAttributes {
    id: number;
    name: string;
    sorting: number;
    songTemplateId: number | null;
    slides: Slide[];
    playlists: Playlist[];
    copyright: SongCopyright;
}

interface songCreationAttributes extends Optional<songAttributes, 'id' | 'songTemplateId' | 'playlists'> { }

@Table({ tableName: 'song' })
export class Song extends Model<songAttributes, songCreationAttributes> {

    @Column
    name: string;

    @Column
    sorting: number;

    @IsOptional()
    @Column
    songTemplateId: number | null;

    @HasMany(() => Slide, { onDelete: 'CASCADE' })
    slides: Slide[];

    @BelongsToMany(() => Playlist, () => PlaylistSong)
    playlists: Playlist[];

    @ForeignKey(() => SongCopyright)
    @Column
    songCopyrightId: number

    @BelongsTo(() => SongCopyright)
    copyright: SongCopyright;

}


