import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { CreateScreenDto } from './dto/create-screen.dto';
import { UpdateScreenDto } from './dto/update-screen.dto';

import { Screen } from './screen.entity';

@Injectable()
export class ScreensService {

    constructor(@Inject('ScreensRepository') private readonly ScreensRepository: typeof Screen) { }

    async findAll(): Promise<Screen[]> {
        return await this.ScreensRepository.findAll<Screen>();
    }

    async findOne(id: number): Promise<Screen> {
        const screen = await this.ScreensRepository.findByPk<Screen>(id);
        if (!screen) {
            throw new HttpException('No screen found', HttpStatus.NOT_FOUND);
        }
        return screen;
    }

    async create(createScreenDto: CreateScreenDto): Promise<Screen> {
        const screen = new Screen();
        screen.name = createScreenDto.name;
        screen.style = createScreenDto.style;
        return screen.save();
    }

    async update(id: number, updateScreenDto: UpdateScreenDto): Promise<Screen> {
        const screen = await this.findOne(id);
        screen.name = updateScreenDto.name || screen.name;
        screen.style = updateScreenDto.style || screen.style;
        return screen.save();
    }

    async delete(id: number) {
        const screen = await this.findOne(id) as Screen;
        await screen.destroy();
    }

}
