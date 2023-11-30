import { Table, Column, Model, HasMany } from 'sequelize-typescript';

import { Slide } from '../slides/slide.entity';

@Table({ tableName: 'song' })
export class Song extends Model {
    @Column
    name: string;

    @Column
    sorting: number;

    @HasMany(() => Slide, { onDelete: 'CASCADE' })
    slides: Slide[];
}


