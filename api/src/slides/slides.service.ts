import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';

import { Slide } from './slide.entity';
import { SlideDto } from './dto/slide.dto';

@Injectable()
export class SlidesService {

    constructor(
        @Inject('SlidesRepository') private readonly slidesRepository: typeof Slide
    ) { }

    async findAll(): Promise<Slide[]> {
        return await this.slidesRepository.findAll<Slide>();
    }

    async findOne(id: number): Promise<Slide> {
        const slide = await this.slidesRepository.findByPk<Slide>(id);
        if (!slide) {
            throw new HttpException('No slide found', HttpStatus.NOT_FOUND);
        }
        return slide;
    }

    async create(createSlideDto: CreateSlideDto): Promise<Slide> {
        const slide = new Slide();
        slide.songId = createSlideDto.songId;
        slide.name = createSlideDto.name;
        slide.type = createSlideDto.type;
        slide.content = createSlideDto.content;
        slide.sorting = createSlideDto.sorting;
        slide.songId = createSlideDto.songId;
        return slide.save();
    }

    async update(id: number, updateSlideDto: UpdateSlideDto): Promise<Slide> {
        const slide = await this.findOne(id);
        slide.name = updateSlideDto.name || slide.name;
        slide.type = updateSlideDto.type || slide.type;
        slide.content = updateSlideDto.content || slide.content;
        slide.sorting = updateSlideDto.sorting || slide.sorting;
        return slide.save();
    }

    async delete(id: number) {
        const slide = await this.findOne(id) as Slide;
        await slide.destroy();
    }

    public async duplicate(slide: SlideDto, songId: number): Promise<Slide> {
        let newSlide = new Slide({
            name: slide.name,
            content: slide.content,
        });
        newSlide.songId = songId;
        newSlide.type = slide.type;
        newSlide.sorting = slide.sorting;

        newSlide.id = undefined;
        return newSlide.save();
    }

}
