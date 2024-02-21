import { isDate, isEmpty, isNumber, isObject, isUndefined } from "lodash";
import { addMilliseconds, differenceInMilliseconds } from "date-fns";

import Song from "./song";
import Slide from "./slide";

import { IPlaylist, Playlist } from "./playlist";
import { PlaylistPlayerSocketEvent } from "../utilities/playlistPlayerSocket";

import { getPlaylistPlayer, setPlaylistPlayer } from "../stores/playlist";

export interface IPlaylistPlayerEventListener {
    event: PlaylistPlayerSocketEvent,
    callback: CallableFunction
}

export class PlaylistPlayer extends Playlist {

    public songs: SongPlayer[];
    protected currentSlideIndex: number | 'start' | 'end' = 'start';
    protected nextSlideIndex: number | 'start' | 'end' = 'start';

    protected isStartSlide: boolean = false;
    protected isPausedSlide: boolean = false;
    protected isEndSlide: boolean = false;
    protected isLoaded: boolean = false;

    protected eventListeners: IPlaylistPlayerEventListener[] = [];

    private constructor(playlist: IPlaylist) {
        super(playlist);
        this.songs = playlist.songs?.map((song: Song) => new SongPlayer(song, this)) ?? [];
    }

    static getInstance(playlist?: IPlaylist): PlaylistPlayer {
        let playlistPlayer = getPlaylistPlayer().get();
        if (isEmpty(playlistPlayer) || (!isUndefined(playlist) && (getPlaylistPlayer().get()?.id ?? 0) !== playlist.id)) {
            setPlaylistPlayer(new PlaylistPlayer(playlist ?? {}));
        }
        return getPlaylistPlayer().get();
    }

    protected emitEvent(event: PlaylistPlayerSocketEvent, args?: any) {
        this.eventListeners.filter((eventListener: IPlaylistPlayerEventListener) => eventListener.event === event).map((eventListener: IPlaylistPlayerEventListener) => eventListener.callback(args));
    }

    public emitCurrentState() {
        if (this.isPaused()) {
            this.emitEvent(PlaylistPlayerSocketEvent.setIsPaused, { content: this.pauseSlide });
        } else if (this.isStarting()) {
            this.emitEvent(PlaylistPlayerSocketEvent.setIsStarting, { content: this.startSlide });
        } else if (this.isEnded()) {
            this.emitEvent(PlaylistPlayerSocketEvent.setIsEnded, { content: this.endSlide });
        } else {
            let currentSlide;
            if (currentSlide = this.getCurrentSlide()) {
                this.emitEvent(PlaylistPlayerSocketEvent.setCurrentSlide, new Slide({...currentSlide}));
            }
        }
    }

    public registerEventListener(event: PlaylistPlayerSocketEvent, callback: CallableFunction) {
        this.eventListeners.push({ event, callback } as IPlaylistPlayerEventListener);
    }

    public isLoading = () => {
        return !this.isLoaded;
    }

    public isStarting = () => { return this.isStartSlide; }
    public isPaused = () => { return this.isPausedSlide; }
    public isEnded = () => { return this.isEndSlide; }

    public doExitPlaylist = () => {
        this.emitEvent(PlaylistPlayerSocketEvent.exitPlaylist, new Playlist(this));
    }

    public doStart = () => {
        this.isPausedSlide = false;
        this.isEndSlide = false;
        this.isStartSlide = true;
        this.currentSlideIndex = 'start';
        this.doQueueSlide(this.getSlides()[0]);
        this.emitCurrentState();
        this.isLoaded = true;
    }

    public doEnd = () => {
        this.isEndSlide = true;
        this.isStartSlide = false;
        this.isPausedSlide = false;
        this.emitCurrentState();
    }

    public doTogglePause = () => {
        if (this.isPausedSlide) {
            this.doUnpause();
        } else {
            this.doPause();
        }
    }

    public doPause = () => {
        this.isPausedSlide = true;
        this.getCurrentSong()?.doPause();
        this.emitEvent(PlaylistPlayerSocketEvent.setIsPaused, { content: this.pauseSlide });
    }

    public doUnpause = () => {
        this.isPausedSlide = false;
        this.getCurrentSong()?.doUnpause();
        this.emitEvent(PlaylistPlayerSocketEvent.setIsUnpaused, this.isStarting() ? { content: this.startSlide } : this.isEnded() ? { content: this.endSlide } : new Slide(this.getCurrentSlide() ?? {} as SlidePlayer));
    }

    public doPlaySlide = (slide: SlidePlayer | 'start' | 'end') => {
        if (slide !== 'start') {
            this.isStartSlide = false;
        }
        if (slide !== 'end') {
            this.isEndSlide = false;
        }
        if (isObject(slide)) {
            slide.getSong().doPlaySlide(slide);
            this.currentSlideIndex = this.findSlideIndex(slide);
            let nextSlideIndex = this.findSlideIndex(this.findNextSlide(slide) ?? {} as SlidePlayer);
            this.nextSlideIndex = nextSlideIndex > -1 ? nextSlideIndex : 'end';
            this.emitCurrentState();
        }
    }

    public doPlayNextSlide = () => {
        if (this.nextSlideIndex === 'start') {
            this.doStart();
            return;
        }
        if (this.nextSlideIndex === 'end') {
            this.doEnd();
            return;
        }
        let currentSlide;
        if (currentSlide = this.getNextSlide() as SlidePlayer) {
            this.doPlaySlide(currentSlide);
            let nextSlide;
            if (nextSlide = currentSlide.getSong().getNextSlide()) {
                // nice and easy if the song has another slide after this one
                this.doQueueSlide(nextSlide);

            } else {
                // new current slide is the last slide of the song
                let nextSong;
                if (nextSong = this.getNextSong(currentSlide.getSong())) {
                    this.doQueueSong(nextSong);
                    this.doQueueSlide(nextSong.getSlides()[0]);
                } else {
                    // is the last song of the playlist
                    this.doQueueEnd();
                }
            }
        } else {
            // playlist has not started yet
            this.doPlaySlide(this.getSongs()[0].getSlides()[0]);
            this.isStartSlide = false;
        }
    }

    public doPlayPreviousSlide = () => {
        let previousSlide;
        if (previousSlide = this.getPreviousSlide()) {
            this.doPlaySlide(previousSlide);
        } else {
            this.doStart();
        }
    }

    public doPlayNextSong = () => {
        let nextSong;
        if (nextSong = this.getNextSong()) {
            this.doPlaySong(nextSong);
        } else {
            this.doEnd();
        }
    }

    public doPlayPreviousSong = () => {
        let previousSong;
        if (previousSong = this.getPreviousSong()) {
            this.doPlaySong(previousSong);
        } else {
            this.doStart();
        }
    }

    public doQueueSong = (song: SongPlayer) => {
        let nextSlide;
        if (nextSlide = song.getSlides()[0] ?? undefined) {
            this.nextSlideIndex = this.findSlideIndex(nextSlide);
            song.doQueueSlide(nextSlide);
        } else {
            console.log(`throw new Error('Cannot queue the song because it does not have any slides');`);
            // throw new Error('Cannot queue the song because it does not have any slides');
        }
    }

    public doQueueSlide = (slide: SlidePlayer) => {
        slide.getSong().doQueueSlide(slide);
        this.nextSlideIndex = this.findSlideIndex(slide)
        this.emitCurrentState();
    }

    public doQueueStart = () => {
        this.currentSlideIndex = 'start';
        this.nextSlideIndex = 0;
        this.emitCurrentState();
    }

    public doQueueEnd = () => {
        this.nextSlideIndex = 'end';
        this.emitCurrentState();
    }

    public doPlaySong = (song: SongPlayer) => {
        this.doQueueSong(song);
        this.doPlaySlide(song.getSlides()[0]);
        this.emitCurrentState();
    }

    public getPreviousSong = (currentSong?: SongPlayer): SongPlayer | void => {
        let previousSongIndex = this.findSongIndex(currentSong ?? this.getCurrentSlide()?.getSong() ?? {} as SongPlayer) ?? -1;
        if (previousSongIndex > -1 && (previousSongIndex - 1) > -1) {
            return this.getSongs()[previousSongIndex - 1];
        }
    }

    public getNextSong = (currentSong?: SongPlayer): SongPlayer | void => {
        let nextSongIndex = this.findSongIndex(currentSong ?? this.getCurrentSong() ?? {} as SongPlayer) ?? -1;
        if (nextSongIndex > -1 && (nextSongIndex + 1) < this.getSongs().length) {
            return this.getSongs()[nextSongIndex + 1];
        }
    }

    public getCurrentSong = (): SongPlayer | void => {
        let currentSong;
        if (currentSong = this.getCurrentSlide()?.getSong()) {
            return currentSong;
        }
    }

    public getPreviousSlide = (): SlidePlayer | void => {
        if (isNumber(this.currentSlideIndex)) {
            if (this.currentSlideIndex > 0) {
                return this.getSlides()[this.currentSlideIndex - 1];
            }
        } else {
            switch (this.currentSlideIndex) {
                case 'end':
                    return [...this.getSlides()].pop();
            }
        }
    }

    public getNextSlide = (): SlidePlayer | "start" | "end" => {
        if (isNumber(this.nextSlideIndex)) {
            return this.getSlides()[this.nextSlideIndex];
        }
        switch (this.nextSlideIndex) {
            case 'start':
                return 'start';
            case 'end':
            default:
                return 'end';
        }

    }

    public getCurrentSlide = (): SlidePlayer | void => {
        if (isNumber(this.currentSlideIndex)) {
            if (this.currentSlideIndex > -1) {
                return this.getSlides()[this.currentSlideIndex];
            }
        } else {
            // console.log('getCurrentSlide is not numeric', this.currentSlideIndex);
        }
    }

    public getSongs = (): SongPlayer[] => {
        return this.songs ?? [];
    }

    public getSlides = (): SlidePlayer[] => {
        return this.getSongs().map((song: SongPlayer) => song.getSlides()).flat();
    }

    public findSongIndex = (song: SongPlayer): number => {
        return this.getSongs().map((_song: SongPlayer) => _song.id).indexOf(song?.id ?? -1)
    }

    public findSlide = (currentSlide: SlidePlayer): SlidePlayer => {
        return this.getSlides().filter((slide: SlidePlayer) => slide.id === currentSlide.id)[0]
    }

    public findNextSlide = (currentSlide?: SlidePlayer): SlidePlayer | void => {
        let nextSlideIndex = currentSlide ? this.findSlideIndex(currentSlide) + 1 : Infinity;
        if (nextSlideIndex < this.getSlides().length) {
            return this.getSlides()[nextSlideIndex];
        }
    }

    public findPreviousSlide = (currentSlide?: SlidePlayer): SlidePlayer | void => {
        let previousSlideIndex = currentSlide ? this.findSlideIndex(currentSlide) - 1 : -1;
        if (previousSlideIndex > -1) {
            return this.getSlides()[previousSlideIndex];
        }
    }

    public findSlideIndex = (slide: SlidePlayer): number => {
        return this.getSlides().map((_slide: SlidePlayer) => _slide.id).indexOf(slide.id)
    }

}


export class SongPlayer extends Song {

    playlist: PlaylistPlayer;
    slides: SlidePlayer[];

    protected currentSlideIndex: number = 0;

    protected isPausedSlide: boolean = false;

    constructor(song: Song, playlistPlayer: PlaylistPlayer) {
        super(song);
        this.playlist = playlistPlayer;
        this.slides = song.slides?.map((slide: Slide) => new SlidePlayer(slide, playlistPlayer, this)) ?? [];
    }

    public isPaused = () => {
        return this.isPausedSlide!;
    }

    public doPause = () => {
        this.getCurrentSlide().doPause();
        this.isPausedSlide = true;
    }

    public doUnpause = () => {
        this.isPausedSlide = false;
        this.getCurrentSlide().doUnpause();
    }

    public doQueueSlide = (slide: SlidePlayer) => {
        this.currentSlideIndex = this.findSlideIndex(slide);
    }

    public doPlaySlide = (slide: SlidePlayer) => {
        this.currentSlideIndex = this.findSlideIndex(slide);
        slide.play();
    }

    public doPlayNextSlide = () => {
        let nextSlide;
        if (nextSlide = this.getNextSlide()) {
            this.doQueueSlide(nextSlide);
        }
    }

    public doPlayPreviousSlide = () => {
        let previousSlide;
        if (previousSlide = this.getPreviousSlide()) {
            this.doQueueSlide(previousSlide);
        }
    }

    public getPreviousSlide = (): SlidePlayer | void => {
        if (this.currentSlideIndex > 0) {
            return this.slides[this.currentSlideIndex - 1];
        }
    }

    public getNextSlide = (): SlidePlayer | void => {
        if (this.currentSlideIndex < (this.slides.length - 1)) {
            return this.slides[this.currentSlideIndex + 1];
        }
    }

    public getCurrentSlide = (): SlidePlayer => {
        return this.slides[this.currentSlideIndex]
    }

    public getSlides = (): SlidePlayer[] => {
        return this.slides ?? [];
    }

    public findSlideIndex = (slide: SlidePlayer): number => {
        return this.slides.map((_slide: SlidePlayer) => _slide.id).indexOf(slide.id);
    }

}


export class SlidePlayer extends Slide {

    playlist: PlaylistPlayer;
    song: SongPlayer;
    startDate: Date | undefined = undefined;
    pauseDate: Date | undefined = undefined;
    accumulatedPauseTime: number = 0;

    constructor(slide: Slide, playlist: PlaylistPlayer, song: SongPlayer) {
        super(slide);
        this.playlist = playlist;
        this.song = song;
    }

    public doPause = () => {
        if (isDate(this.pauseDate)) {
            let accumulatedPauseTime = differenceInMilliseconds(new Date(), this.pauseDate);
            this.accumulatedPauseTime = this.accumulatedPauseTime + accumulatedPauseTime;
        }
        this.pauseDate = new Date();
    }

    public doUnpause = () => {
        if (isDate(this.pauseDate)) {
            let accumulatedPauseTime = differenceInMilliseconds(new Date(), this.pauseDate);
            this.accumulatedPauseTime = this.accumulatedPauseTime + accumulatedPauseTime;
        }
        this.pauseDate = undefined;
    }

    public getLines = (): string[] => {
        return this.content.split("\n");
    }

    public getSong = (): SongPlayer => {
        return this.song;
    }

    public play = () => {
        this.accumulatedPauseTime = 0;
        this.startDate = new Date();
    }

    public getTimeRemaining = (): number => {
        if (this.duration > 0 && isDate(this.startDate)) {
            return differenceInMilliseconds(new Date(), addMilliseconds(this.startDate, (this.duration + this.accumulatedPauseTime)))
        }
        return Infinity;
    }

}
