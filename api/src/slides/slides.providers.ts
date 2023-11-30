import { Slide } from './slide.entity';

export const slidesProviders = [{ provide: 'SlidesRepository', useValue: Slide }];
