import { Controller, Get, Post, Put, Patch, Delete, Param, Body } from '@nestjs/common';

import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';

import { Setting } from './settings.entity';

import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {

    constructor(
        private readonly settingsService: SettingsService
    ) { }

    @Get()
    findAll(): Promise<Setting[]> {
        return this.settingsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Setting> {
        return this.settingsService.findOne(id);
    }

    @Post()
    async create(@Body() createSettingsDto: CreateSettingDto): Promise<Setting> {
        return this.settingsService.create(createSettingsDto);
    }

    @Patch()
    async update(@Body('name') name: string, @Body('value') value: any): Promise<Setting> {
        console.log('I patch /update settings of name '+name+' and value '+value);
        return this.settingsService.updateByName(name, value);
    }

    @Put(':id')
    async replace(@Param('id') id: number, @Body() settings: CreateSettingDto): Promise<Setting> {
        return this.settingsService.update(id, settings);
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        await this.settingsService.delete(id);
    }


}
