import { Controller, Get, Post, Put, Patch, Delete, Param, Body } from '@nestjs/common';

import { CreateScreenDto } from './dto/create-screen.dto';
import { UpdateScreenDto } from './dto/update-screen.dto';

import { Screen } from './screen.entity';

import { ScreensService } from './screens.service';

@Controller('screens')
export class ScreensController {

    constructor(
        private readonly screensService: ScreensService
    ) { }

    @Get()
    findAll(): Promise<Screen[]> {
        return this.screensService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Screen> {
        return this.screensService.findOne(id);
    }

    @Post()
    async create(@Body() createScreenDto: CreateScreenDto): Promise<Screen> {
        return this.screensService.create(createScreenDto);
    }

    @Patch(':id')
    async update(@Param('id') id: number, @Body() screen: UpdateScreenDto): Promise<Screen> {
        return this.screensService.update(id, screen);
    }

    @Put(':id')
    async replace(@Param('id') id: number, @Body() screen: CreateScreenDto): Promise<Screen> {
        return this.screensService.update(id, screen);
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        await this.screensService.delete(id);
    }

    @Post('setSorting')
    async setSorting(@Body('sortedIds') sortedIds: string) {
        sortedIds.split(',').forEach(async (screenId: string, sorting: number) => {
            let screen = await this.screensService.findOne(parseInt(screenId));
            screen.save();
        });
    }

}
