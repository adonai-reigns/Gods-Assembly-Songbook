import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { has, set, get } from 'lodash';

import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';

import { Setting } from './settings.entity';

@Injectable()
export class SettingsService {

    constructor(@Inject('SettingsRepository') private readonly SettingsRepository: typeof Setting) { }

    async findAll(): Promise<Setting[]> {
        return await this.SettingsRepository.findAll<Setting>();
    }

    async findOne(id: number): Promise<Setting> {
        const settings = await this.SettingsRepository.findByPk<Setting>(id);
        if (!settings) {
            throw new HttpException('No settings found', HttpStatus.NOT_FOUND);
        }
        return settings;
    }

    async findOneBy(search): Promise<Setting> {
        console.log('findOneBy: ', search);
        const settings = await this.SettingsRepository.findOne<Setting>(search);
        if (!settings) {
            throw new HttpException('No settings found', HttpStatus.NOT_FOUND);
        }
        return settings;
    }



    async create(createSettingsDto: CreateSettingDto): Promise<Setting> {
        const settings = new Setting();
        Object.keys(settings).map((keyname: string) => {
            if (has(createSettingsDto, keyname)) {
                set(settings, keyname, get(createSettingsDto, keyname));
            }
        });
        return settings.save();
    }

    async update(id: number, updateSettingsDto: UpdateSettingDto): Promise<Setting> {
        const settings = await this.findOne(id);
        Object.keys(settings).map((keyname: string) => {
            if (has(updateSettingsDto, keyname)) {
                set(settings, keyname, get(updateSettingsDto, keyname));
            }
        });
        return settings.save();
    }

    async updateByName(name: string, value: any): Promise<Setting> {
        const settings = await this.findOneBy({where:{ name }});
        console.log('found setting by name', settings);
        settings.value = value;
        return settings.save();
    }

    async delete(id: number) {
        const settings = await this.findOne(id) as Setting;
        await settings.destroy();
    }

}
