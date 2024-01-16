import { Socket, io } from 'socket.io-client';
import { atom } from 'nanostores';

const urlStore = atom<URL>(new URL(window.location.href));
const socketUrlStore = atom<string>(urlStore.get().protocol + '//' + urlStore.get().hostname + ':3000/live');
const apiUrlStore = atom<string>(urlStore.get().protocol + '//' + urlStore.get().hostname + ':3000/api');
const liveSocketStore = atom<Socket|undefined>();

export const getApiUrl = (): string => {
    return apiUrlStore.get();
}

export const getSocketUrl = (): string => {
    return socketUrlStore.get();
}

export const getLiveSocket = (): Socket => {
    let socket = liveSocketStore.get();
    if (socket === undefined) {
        socket = io(socketUrlStore.get());
        liveSocketStore.set(socket);
        return socket;
    }else{
        return socket;
    }
}
