import { Optional } from 'sequelize';
import { Table, Column, Model, DataType, ForeignKey, BelongsTo, Default, AllowNull } from 'sequelize-typescript';

import { Song } from 'src/songs/song.entity';

export enum SlideType {
    Intro = 'Intro',
    Verse = 'Verse',
    PreChorus = 'PreChorus',
    Chorus = 'Chorus',
    PostChorus = 'PostChorus',
    Bridge = 'Bridge',
    Outro = 'Outro',
    Hook = 'Hook'
}

export const defaultSlideType = SlideType.Verse;

interface slideAttributes {
    id: number;
    type: SlideType;
    name: string;
    content: string;
}

interface slideCreationAttributes extends Optional<slideAttributes, 'id'> { }

@Table({ tableName: "slide" })
export class Slide extends Model<slideAttributes, slideCreationAttributes> {

    @Default('')
    @AllowNull(false)
    @Column
    name: string;

    @Column(DataType.STRING)
    type: string;

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
