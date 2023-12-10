import { Screen } from './screen.entity';

export const screensProviders = [{ provide: 'ScreensRepository', useValue: Screen }];
