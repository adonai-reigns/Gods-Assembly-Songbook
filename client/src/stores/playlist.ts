import { atom, WritableAtom } from 'nanostores';
import { isUndefined } from 'lodash';

export const playlistPlayerStore = atom<any>({});
export const playlistPatches = atom<any[]>([]);

export function setPlaylistPlayer(playlistPlayer: any) {
    playlistPlayerStore.set(playlistPlayer);
}

export function getPlaylistPlayer(): WritableAtom<any> {
    return playlistPlayerStore;
}

export function patchPlaylist(patches: any) {
    playlistPatches.set([...playlistPatches.get(), patches]);
}

export const getPlaylistPatches = function (reset?: boolean): any[] {
    let _playlistPatches = playlistPatches.get();
    if (isUndefined(reset) || reset) {
        playlistPatches.set([]);
    }
    return _playlistPatches;
}



