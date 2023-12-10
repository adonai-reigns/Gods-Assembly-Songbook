import { Optional } from 'sequelize';
import { Table, Column, Model, DataType } from 'sequelize-typescript';

export enum Size {
    extraSmall = 'extraSmall',
    small = 'small',
    normal = 'normal',
    big = 'big',
    huge = 'huge',
    jumbo = 'jumbo'
}

export enum TextAlign {
    left = 'left',
    center = 'center',
    right = 'right',
    justify = 'justify'
}

export class ScreenStyle {
    fontSize: Size = Size.normal;
    padding: Size = Size.normal;
    textAlign: TextAlign = TextAlign.center;
    showSlidetype: boolean = true;
}

interface screenAttributes {
    id: number;
    name: string;
    style: string;
}

interface screenCreationAttributes extends Optional<screenAttributes, 'id'> { }

@Table({ tableName: "screen" })
export class Screen extends Model<screenAttributes, screenCreationAttributes> {
    @Column
    name: string;

    @Column(DataType.TEXT)

    get style(): ScreenStyle {
        return JSON.parse(this.getDataValue('style'))
    }

    set style(value: ScreenStyle) {
        this.setDataValue('style', JSON.stringify(value));
    }

}
