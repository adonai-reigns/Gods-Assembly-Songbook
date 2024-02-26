import { Socket } from "socket.io-client";

import { PlaylistPlayer } from "../models/playlistPlayer";

export enum PlaylistPlayerSocketEvent {
    requestCurrentState = 'requestCurrentState',
    setIsStarting = 'setIsStarting',
    setIsPaused = 'setIsPaused',
    setIsUnpaused = 'setIsUnpaused',
    setIsEnded = 'setIsEnded',
    setCurrentSlide = 'setCurrentSlide',
    setNextSlide = 'setNextSlide',
    setCurrentSong = 'setCurrentSong',
    exitPlaylist = 'exitPlaylist',
}

interface IPlaylistPlayerSocketEventListener {
    event: PlaylistPlayerSocketEvent,
    callback: CallableFunction
}

export class PlaylistPlayerSocket {

    socket: Socket;

    protected eventListeners: IPlaylistPlayerSocketEventListener[] = [];
    protected playlistPlayers: PlaylistPlayer[] = [];

    constructor(liveSocket: Socket) {
        this.socket = liveSocket;
    }

    destructor() {
        this.closeListeners();
    }

    initListeners(playlistPlayer: PlaylistPlayer) {

        if (this.playlistPlayers.filter((_playlistPlayer) => _playlistPlayer.id === playlistPlayer.id).length < 1) {
            this.playlistPlayers.push(playlistPlayer);
        }

        [
            PlaylistPlayerSocketEvent.exitPlaylist,
            PlaylistPlayerSocketEvent.setCurrentSlide,
            PlaylistPlayerSocketEvent.setCurrentSong,
            PlaylistPlayerSocketEvent.setNextSlide,
            PlaylistPlayerSocketEvent.setIsEnded,
            PlaylistPlayerSocketEvent.setIsPaused,
            PlaylistPlayerSocketEvent.setIsUnpaused,
            PlaylistPlayerSocketEvent.setIsStarting,
            PlaylistPlayerSocketEvent.requestCurrentState
        ].map((event: PlaylistPlayerSocketEvent) => {
            // listen for events emitted by the playlistPlayer, and emit the event to the socket
            playlistPlayer.registerEventListener(event, (args: any) => this.broadcastPlaylistEvent(event, args));

            // create listeners to process broadcast messages from the socket for any components that want to receive them 
            this.socket.on(event, (payload: any) => this.pushEvent(event, payload));
        });

    }

    closeListeners() {
        Object.keys(PlaylistPlayerSocketEvent).map((eventName: string) => this.socket.off(eventName));
    }

    public registerEventListener(event: PlaylistPlayerSocketEvent, callback: CallableFunction) {
        this.eventListeners.push({ event, callback } as IPlaylistPlayerSocketEventListener);
    }

    protected pushEvent(event: PlaylistPlayerSocketEvent, args?: any) {
        if (event === PlaylistPlayerSocketEvent.requestCurrentState) {
            this.playlistPlayers.map((playlistPlayer: PlaylistPlayer) => playlistPlayer.emitCurrentState());
        }
        this.eventListeners.filter((eventListener: IPlaylistPlayerSocketEventListener) => eventListener.event === event).map((eventListener: IPlaylistPlayerSocketEventListener) => eventListener.callback(args));
    }

    protected broadcastPlaylistEvent(event: PlaylistPlayerSocketEvent, args: any) {
        this.socket.emit(event, args);
    }

}
