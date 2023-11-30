import { Song } from './song.entity';

export const songsProviders = [{ provide: 'SongsRepository', useValue: Song }];
