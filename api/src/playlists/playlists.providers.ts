import { Playlist, PlaylistSong } from './playlist.entity';

export const playlistsProviders = [
    { provide: 'PlaylistsRepository', useValue: Playlist },
    { provide: 'PlaylistsSongsRepository', useValue: PlaylistSong }
];
