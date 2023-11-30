import { Optional } from 'sequelize';
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';

import { Song } from 'src/songs/song.entity';

interface slideAttributes {
    id: number;
    name: string;
    content: string;
}

interface slideCreationAttributes extends Optional<slideAttributes, 'id'> { }

@Table({ tableName: "slide" })
export class Slide extends Model<slideAttributes, slideCreationAttributes> {
    @Column
    name: string;

    @Column(DataType.TEXT)
    content: string;

    @Column(DataType.NUMBER)
    sorting: number;

    @ForeignKey(() => Song)
    @Column
    songId: number;

    @BelongsTo(() => Song)
    song: Song;
}
