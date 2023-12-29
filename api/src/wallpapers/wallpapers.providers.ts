import { Wallpaper } from './wallpaper.entity';

export const wallpapersProviders = [{ provide: 'WallpapersRepository', useValue: Wallpaper }];
