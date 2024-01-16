import { Setting } from './settings.entity';

export const settingsProviders = [{ provide: 'SettingsRepository', useValue: Setting }];
