import { Setting } from '../settings.entity';

export class SettingDto {
    readonly id: number;
    readonly name: string;
    readonly value: string;
    readonly description: string;

    constructor(setting: Setting) {
        this.id = setting.id;
        this.name = setting.name;
        this.value = setting.value;
        this.description = setting.description;
    }
}
