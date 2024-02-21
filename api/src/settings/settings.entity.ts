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
        let returnValue;
        try {
            returnValue = JSON.parse(this.getDataValue('value') ?? '');
        } catch (e) {
            console.error('Could not decode value from tableName settings', this.getDataValue('name'), e, this.getDataValue('value'));
        }
        return returnValue;
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
        description: 'The button that is used for the left-button.',
    },
    {
        id: 12,
        name: 'clickerRightButtonCharCode',
        value: 'ArrowRight',
        description: 'The button that is used for the right-button.',
    },
    {
        id: 13,
        name: 'clickerUpButtonCharCode',
        value: 'ArrowUp',
        description: 'The button that is used for the up-button.',
    },
    {
        id: 14,
        name: 'clickerDownButtonCharCode',
        value: 'ArrowDown',
        description: 'The button that is used for the down-button.',
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
        description: 'The delay time in milliseconds before a longpress event is detected, after a button has been held down.',
    },
    {
        id: 18,
        name: 'clickerIgnoreTypingDelay',
        value: 350,
        description: 'The minimum time in milliseconds to wait between key press events. This can be used to ignore typing, or disabled by setting to zero.',
    },
    {
        id: 19,
        name: 'clickerSuppressKeyDefaults',
        value: ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"],
        description: 'List every button that should be suppressed while the songlist is playing. This will prevent the buttons from doing what they normally do when a songlist is playing.',
    },

];

