import { Controller, Get, Post, Put, Patch, Delete, Param, Body } from '@nestjs/common';

import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';

import { Slide } from './slide.entity';

import { SlidesService } from './slides.service';

@Controller('slides')
export class SlidesController {

    constructor(
        private readonly slidesService: SlidesService
    ) { }

    @Get()
    findAll(): Promise<Slide[]> {
        return this.slidesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Slide> {
        return this.slidesService.findOne(id);
    }

    @Post()
    async create(@Body() createSlideDto: CreateSlideDto): Promise<Slide> {
        return this.slidesService.create(createSlideDto);
    }

    @Patch(':id')
    async update(@Param('id') id: number, @Body() slide: UpdateSlideDto): Promise<Slide> {
        return this.slidesService.update(id, slide);
    }

    @Put(':id')
    async replace(@Param('id') id: number, @Body() slide: CreateSlideDto): Promise<Slide> {
        return this.slidesService.update(id, slide);
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        await this.slidesService.delete(id);
    }

    @Post('setSorting')
    async setSorting(@Body('sortedIds') sortedIds: string) {
        sortedIds.split(',').forEach(async (slideId: string, sorting: number) => {
            let slide = await this.slidesService.findOne(parseInt(slideId));
            slide.sorting = sorting;
            slide.save();
        });
    }

}
