import { Table, Column, Model, BelongsToMany, HasMany } from 'sequelize-typescript';

import { Optional } from 'sequelize';
import { Song } from './song.entity';

interface songCopyrightAttributes {
    id: number;
    description?: string;
    author?: string;
    publisher?: string;
    year?: string;
    url?: string;
}

interface songCopyrightCreationAttributes extends Optional<songCopyrightAttributes, 'id'> { }

@Table({ tableName: 'songCopyright' })
export class SongCopyright extends Model<songCopyrightAttributes, songCopyrightCreationAttributes> {

    @Column
    description?: string;

    @Column
    author?: string;

    @Column
    publisher?: string;

    @Column
    year?: string;

    @Column
    url?: string;

    @HasMany(() => Song)
    songs: Song[];

}
