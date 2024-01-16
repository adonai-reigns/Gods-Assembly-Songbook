import { Optional } from 'sequelize';
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';

export interface settingsAttributes {
    id: number;
    name: string;
    value: any;
    description: string;
}

interface settingsCreationAttributes extends Optional<settingsAttributes, 'id'> { }

@Table({ tableName: "settings" })
export class Setting extends Model<settingsAttributes, settingsCreationAttributes> {
    @Column
    name: string;

    @Column(DataType.TEXT)
    get value(): any {
        return JSON.parse(this.getDataValue('value') ?? '');
    }

    set value(value: any) {
        this.setDataValue('value', JSON.stringify(value));
    }

    @Column(DataType.TEXT)
    description: string;


}



export const defaultSettings: settingsAttributes[] = [
    {
        id: 1,
        name: '',
        value: '',
        description: '',
    },
    {
        id: 2,
        name: '',
        value: '',
        description: '',
    },
    {
        id: 3,
        name: '',
        value: '',
        description: '',
    },
    {
        id: 4,
        name: '',
        value: '',
        description: '',
    },
    {
        id: 5,
        name: '',
        value: '',
        description: '',
    },
    {
        id: 6,
        name: '',
        value: '',
        description: '',
    },
    {
        id: 7,
        name: '',
        value: '',
        description: '',
    },
    {
        id: 8,
        name: '',
        value: '',
        description: '',
    },
    {
        id: 9,
        name: '',
        value: '',
        description: '',
    },
    {
        id: 10,
        name: '',
        value: '',
        description: '',
    },
    {
        id: 11,
        name: 'clickerLeftButtonCharCode',
        value: 'ArrowLeft',
        description: '',
    },
    {
        id: 12,
        name: 'clickerRightButtonCharCode',
        value: 'ArrowRight',
        description: '',
    },
    {
        id: 13,
        name: 'clickerUpButtonCharCode',
        value: 'ArrowUp',
        description: '',
    },
    {
        id: 14,
        name: 'clickerDownButtonCharCode',
        value: 'ArrowDown',
        description: '',
    },
    {
        id: 15,
        name: '',
        value: '',
        description: '',
    },
    {
        id: 16,
        name: '',
        value: '',
        description: '',
    },
    {
        id: 17,
        name: 'clickerLongpressTimeout',
        value: 400,
        description: '',
    },
    {
        id: 18,
        name: 'clickerIgnoreTypingDelay',
        value: 350,
        description: '',
    },
    {
        id: 19,
        name: 'clickerSuppressKeyDefaults',
        value: ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"],
        description: '',
    },

];



