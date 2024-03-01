import { Table, Column, Model, HasMany } from 'sequelize-typescript';

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

export const SongCopyrightLabels = {
    description: 'Description',
    author: 'Author',
    publisher: 'Publisher',
    year: 'Year',
    url: 'URL'
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
