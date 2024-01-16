import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { withOrientationChange } from 'react-device-detect';
import { getApiUrl, getLiveSocket } from '../../stores/server';
import axios from "axios";

import { useKeyPress } from "../../hooks/keypress";

import { Dialog } from "primereact/dialog";

import PlaylistPicker from "../../components/PlaylistPicker";
import Button, { ButtonSeverity } from '../../components/Button';
import Tile from "../../components/Tile";

import Slide, { SlideTypeClassNames, SlideTypeLabels } from "../../models/slide";

import type { Playlist } from "../../models/playlist";
import Song from "../../models/song";

import AudienceScreenConfig from "../admin/audience-screen-config";

import PlainLayout from "../../layouts/PlainLayout";
import GasLayout from "../../layouts/GasLayout";

import { getSettingValue } from "../../stores/settings";

import "./sing.scss";

export interface propsInterface {
    className?: string;
    isLandscape?: boolean;
    isPortrait?: boolean;
}

export const propsDefaults = {
    className: ''
}

export interface slideTilePropsInterface {
    key: any;
    className?: string;
    slide: Slide;
    publishedSlide: Slide | PlaylistSlideType;
    nextSlide?: Slide | PlaylistSlideType;
    setNextSlide: CallableFunction;
}

export const slideTilePropsDefaults = {
    className: ''
}

export interface songTilePropsInterface {
    key: any;
    className?: string;
    song: Song;
    publishedSong: Song;
    nextSong: Song | undefined;
    setNextSong: CallableFunction;
}

export const songTilePropsDefaults = {
    className: ''
}

enum PlaylistSlideType {
    start = 'start',
    pause = 'pause',
    end = 'end'
}

const Sing = function (props: propsInterface) {

    props = { ...propsDefaults, ...props };

    const LiveSocket = getLiveSocket();
    const apiUrl = getApiUrl();

    const params = useParams();
    const navigate = useNavigate();

    const isPortrait = props.isPortrait ?? false;
    const isLandscape = !isPortrait;

    const defaultSlide = new Slide();
    defaultSlide.name = defaultSlide.content = '';

    const defaultSong = new Song();
    defaultSong.name = '';

    const clickerLeftButton = getSettingValue('clickerLeftButtonCharCode') ?? 'ArrowLeft';
    const clickerRightButton = getSettingValue('clickerRightButtonCharCode') ?? 'ArrowRight';
    const clickerUpButton = getSettingValue('clickerUpButtonCharCode') ?? 'ArrowUp';
    const clickerDownButton = getSettingValue('clickerDownButtonCharCode') ?? 'ArrowDown';
    const clickerLongpressTimeout = getSettingValue('clickerLongpressTimeout') ?? 1000;
    const clickerIgnoreTypingDelay = getSettingValue('clickerIgnoreTypingDelay') ?? 1000;
    const clickerSuppressKeyDefaults = getSettingValue('clickerSuppressKeyDefaults') ?? '';

    const clickerLeftButtonRef = useRef<HTMLDivElement>(null);
    const clickerRightButtonRef = useRef<HTMLDivElement>(null);
    const clickerUpButtonRef = useRef<HTMLDivElement>(null);
    const clickerDownButtonRef = useRef<HTMLDivElement>(null);
    const clickerLeftHoldButtonRef = useRef<HTMLDivElement>(null);
    const clickerRightHoldButtonRef = useRef<HTMLDivElement>(null);
    const clickerUpHoldButtonRef = useRef<HTMLDivElement>(null);
    const clickerDownHoldButtonRef = useRef<HTMLDivElement>(null);

    const [clickerPosition, setClickerPosition] = useState<'songs' | 'slides' | 'live'>('live');
    const [clickerFocusedSlide, setClickerFocusedSlide] = useState<Slide | undefined>();
    const [clickerFocusedSong, setClickerFocusedSong] = useState<Song | undefined>();

    const [isPaused, setIsPaused] = useState<boolean>(false);

    const [showConfig, setShowConfig] = useState<boolean>(false);

    const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);

    const [publishedSlide, setPublishedSlide] = useState<Slide | PlaylistSlideType>(PlaylistSlideType.start);
    const [nextSlide, setNextSlide] = useState<Slide | PlaylistSlideType>(PlaylistSlideType.start);

    const [publishedSong, setPublishedSong] = useState<Song>(defaultSong);
    const [openSong, setOpenSong] = useState<Song | undefined>(defaultSong);
    const [nextSong, setNextSong] = useState<Song | undefined>(defaultSong);

    const exitScreen = () => {
        if (confirm('Are you sure?')) {
            LiveSocket.emit('exitPlaylist', { playlist: currentPlaylist });
            navigate('/songleader');
        }
    }

    const getPublishedSlideContent = () => {

        if (currentPlaylist) {
            if (isPaused) {
                return currentPlaylist.pauseSlide;
            }
            if (publishedSlide) {
                switch (publishedSlide) {
                    case PlaylistSlideType.start:
                        return currentPlaylist.startSlide;
                    case PlaylistSlideType.pause:
                        return currentPlaylist.pauseSlide;
                    case PlaylistSlideType.end:
                        return currentPlaylist.endSlide;
                    default:
                        if (publishedSlide.content) {
                            return publishedSlide.content;
                        } else {
                            return '';
                        }
                }
            }
        }
    }

    const getNextSlideContent = (): string => {
        if (currentPlaylist) {
            if (nextSlide instanceof Object) {
                return nextSlide.content;
            } else {
                if (nextSlide === PlaylistSlideType.end) {
                    // next slide will be the end content
                    return currentPlaylist?.endSlide;
                } else {
                    // has not started yet
                    return '';
                }
            }
        } else {
            return '';
        }
    }

    const playPreviousSlide = () => {
        if (currentPlaylist) {
            if (publishedSlide instanceof Object && publishedSlide.id) {
                let publishedSlideIndex = publishedSong.slides.map((slide: Slide) => slide.id).indexOf(publishedSlide.id);
                if (publishedSlideIndex - 1 > -1) {
                    // the previous slide will be in the same song
                    if (openSong !== undefined) {
                        setPublishedSlide(openSong.slides[publishedSlideIndex - 1]);
                        setNextSlide(openSong.slides[publishedSlideIndex]);
                    }
                } else {
                    // the previous slide will be from the previous song
                    let currentSongIndex = currentPlaylist?.songs.map((song: Song) => song.id).indexOf(publishedSong.id) ?? -1;
                    if (currentSongIndex - 1 > -1) {
                        setPublishedSong(currentPlaylist.songs[currentSongIndex - 1]);
                        setPublishedSlide(publishedSong.slides[publishedSong.slides.length - 1]);
                    } else {
                        // there is no previous song, the next slide will be the start slide
                        setPublishedSlide(PlaylistSlideType.start);
                        setNextSlide(currentPlaylist.songs[0].slides[0] ?? currentPlaylist.startSlide);
                    }

                }
            } else {
                if (publishedSlide === currentPlaylist.pauseSlide) {
                    setIsPaused(false);
                } else if (publishedSlide === PlaylistSlideType.end) {
                    let lastSong = currentPlaylist.songs[currentPlaylist.songs.length - 1];
                    setPublishedSong(lastSong);
                    setPublishedSlide(lastSong.slides[lastSong.slides.length - 1]);
                }
            }
        }
    }

    const playNextSlide = () => {

        if (currentPlaylist) {

            if (nextSlide instanceof Object && nextSlide.id) {

                setPublishedSlide(nextSlide);

                let nextSlideIndex = publishedSong.slides.map((slide: Slide) => slide.id).indexOf(nextSlide.id);

                if (nextSlide.songId === publishedSong.id) {

                    if (nextSlideIndex + 1 === publishedSong.slides.length) {
                        // it's the last slide of the song
                        let currentSongIndex = currentPlaylist?.songs.map((song: Song) => song.id).indexOf(publishedSong.id) ?? -1;
                        if (currentSongIndex + 1 === currentPlaylist?.songs.length) {
                            // it's the last song of the playlist
                            setPublishedSlide(nextSlide);
                            setNextSlide(PlaylistSlideType.end);
                        } else {
                            setNextSong(currentPlaylist.songs[(currentSongIndex + 1)]);
                        }
                    } else {
                        setNextSlide(publishedSong.slides[(nextSlideIndex + 1)]);
                    }

                } else {
                    // the queued slide is from a different song

                    let slideSong = currentPlaylist.songs.filter((song: Song) => song.id === nextSlide.songId)[0];
                    nextSlideIndex = (slideSong.slides.map((slide: Slide) => slide.id).indexOf(nextSlide.id) + 1);

                    if (nextSlideIndex < slideSong.slides.length) {
                        setNextSlide(slideSong.slides[nextSlideIndex]);
                    } else {
                        // the song only has one slide
                        let nextSongIndex = currentPlaylist.songs.filter((song: Song) => song.slides.length > 0).map((song: Song) => song.id).indexOf(nextSlide.songId) + 1;
                        let nextSong = currentPlaylist.songs.filter((song: Song) => song.slides.length > 0)[nextSongIndex];
                        if (nextSong) {
                            setNextSong(nextSong);
                            setOpenSong(nextSong);
                            setNextSlide(nextSong.slides[0]);
                        } else {
                            // it's the last song of the playlist
                            setNextSong(undefined);
                            setNextSlide(PlaylistSlideType.end);
                        }
                    }

                }

            } else if (nextSlide === PlaylistSlideType.end) {
                // play the end slide
                setOpenSong(undefined);
                setPublishedSlide(PlaylistSlideType.end);
                return currentPlaylist.endSlide;
            }

            if (isPaused) {
                setIsPaused(false);
            }

        }

    }

    const loadPlaylistById = (playlistId: number): Playlist | null => {
        axios.get(apiUrl + '/playlists/' + playlistId).then((response) => {
            setCurrentPlaylist(response.data as Playlist);
        });
        return null;
    }

    const handleLeftButtonPress = () => {
        switch (clickerPosition) {
            /**
            * Clicking the right button on the live view will play the previous slide
            */
            case 'live':
                playPreviousSlide();
                break;

            /**
            * Clicking the left button on the slides view will move the clicker focus through the slides
            */
            case 'slides':
                if (clickerFocusedSlide && openSong) {
                    let focusedSlideIndex = openSong.slides.map((slide: Slide) => slide.id).indexOf(clickerFocusedSlide.id);
                    let nextSlideIndex = focusedSlideIndex - 1;
                    if (nextSlideIndex < 0) {
                        nextSlideIndex = openSong.slides.length - 1;
                    }
                    setClickerFocusedSlide(openSong.slides[nextSlideIndex]);
                }
                break;

            /**
            * Clicking the left button on the songs view will move the clicker focus through the songs
            */
            case 'songs':
                if (clickerFocusedSong && currentPlaylist) {
                    let focusedSongIndex = currentPlaylist.songs.map((song: Song) => song.id).indexOf(clickerFocusedSong.id);
                    let nextSongIndex = focusedSongIndex - 1;
                    if (nextSongIndex < 0) {
                        nextSongIndex = currentPlaylist.songs.length - 1;
                    }
                    setClickerFocusedSong(currentPlaylist.songs[nextSongIndex]);
                }
                break;
        }
    }

    const handleRightButtonPress = () => {
        switch (clickerPosition) {
            /**
            * Clicking the right button on the live view will play the next slide
            */
            case 'live':
                playNextSlide();
                break;

            /**
            * Clicking the right button on the slides view will move the clicker focus through the slides
            */
            case 'slides':
                if (clickerFocusedSlide && openSong) {
                    let focusedSlideIndex = openSong.slides.map((slide: Slide) => slide.id).indexOf(clickerFocusedSlide.id);
                    let nextSlideIndex = focusedSlideIndex + 1;
                    if (nextSlideIndex >= openSong.slides.length) {
                        nextSlideIndex = 0;
                    }
                    setClickerFocusedSlide(openSong.slides[nextSlideIndex]);
                }
                break;

            /**
            * Clicking the right button on the songs view will move the clicker focus through the songs
            */
            case 'songs':
                if (clickerFocusedSong && currentPlaylist) {
                    let focusedSongIndex = currentPlaylist.songs.map((song: Song) => song.id).indexOf(clickerFocusedSong.id);
                    let nextSongIndex = focusedSongIndex + 1;
                    if (nextSongIndex >= currentPlaylist.songs.length) {
                        nextSongIndex = 0;
                    }
                    setClickerFocusedSong(currentPlaylist.songs[nextSongIndex]);
                }
                break;
        }
    }

    /**
     * Clicking the up button moves the clicker focus from songs to slides to live view
     */
    const handleUpButtonPress = () => {
        switch (clickerPosition) {
            case 'live':
                if (currentPlaylist) {
                    setClickerPosition('slides');
                    if (publishedSlide instanceof Object && publishedSlide.songId === openSong?.id) {
                        setClickerFocusedSlide(publishedSlide);
                    } else {
                        setClickerFocusedSlide(openSong?.slides[0]);
                    }
                }
                break;
            case 'slides':
                if (currentPlaylist) {
                    setClickerPosition('songs');
                    if (openSong instanceof Object) {
                        setClickerFocusedSong(openSong);
                    } else {
                        setClickerFocusedSong(currentPlaylist.songs[0]);
                    }
                }

                break;
            case 'songs':
                setClickerPosition('live');
                break;
        }
    }

    /**
     * Clicking the down button moves the clicker focus from songs to slides to live view
     */
    const handleDownButtonPress = () => {
        switch (clickerPosition) {
            case 'live':
                if (currentPlaylist) {
                    setClickerPosition('songs');
                    if (openSong instanceof Object) {
                        setClickerFocusedSong(openSong);
                    } else {
                        setClickerFocusedSong(currentPlaylist.songs[0]);
                    }
                }
                break;

            case 'slides':
                setClickerPosition('live');
                break;

            case 'songs':
                if (currentPlaylist) {
                    setClickerPosition('slides');
                    if (openSong instanceof Object) {
                        setClickerFocusedSong(openSong);
                    } else {
                        setClickerFocusedSong(currentPlaylist.songs[0]);
                    }
                }
                break;
        }
    }

    /**
     * Holding-down the left button toggles pause on/off
     */
    const handleLeftButtonHold = () => {
        setIsPaused(!isPaused);
    }

    const handleRightButtonHold = () => {
        switch (clickerPosition) {
            case 'live':
                if (currentPlaylist) {
                    /**
                     * Holding-down the right button in the live view will unpause and plays the next slide, if it is currently paused
                     */
                    if (isPaused) {
                        setIsPaused(false);
                        if (nextSlide) {
                            setPublishedSlide(nextSlide);
                        }
                    } else {
                        /**
                         * Holding-down the right button in the live view will play the next song, if it is not currently paused
                         */
                        let currentSongIndex = currentPlaylist.songs.map((song: Song) => song.id).indexOf(publishedSong.id);
                        let nextSongIndex = currentSongIndex + 1;
                        if (nextSongIndex >= currentPlaylist.songs.length) {
                            setPublishedSlide(PlaylistSlideType.end);
                        } else {
                            setPublishedSlide(currentPlaylist.songs[nextSongIndex].slides[0]);
                        }
                    }
                }
                break;
            case 'slides':
                if (clickerFocusedSlide) {
                    if (isPaused) {
                        /**
                         * Holding-down the right button in the slides view will set the focussed slide as the next slide, if it is paused
                         */
                        setNextSlide(clickerFocusedSlide);
                    } else {
                        /**
                         * Holding-down the right button in the slides view will set the focussed slide as the published slide, if it is not paused
                         */
                        setPublishedSlide(clickerFocusedSlide);
                    }
                }
                break;
            case 'songs':
                if (clickerFocusedSong) {
                    if (isPaused) {
                        /**
                         * Holding-down the right button in the songs view will set the focussed song as the next song, if it is paused
                         */
                        setNextSlide(clickerFocusedSong.slides[0]);
                    } else {
                        /**
                         * Holding-down the right button in the songs view will set the focussed song as the published song, if it is not paused
                         */
                        setPublishedSlide(clickerFocusedSong.slides[0]);
                    }
                }
                break;
        }
    }

    const handleUpButtonHold = () => {
        // not implemented
    }

    const handleDownButtonHold = () => {
        // not implemented
    }

    const handleKeyDownEvent = () => {
        // not implemented
    };

    const handleKeyUpEvent = (e: any) => {

        let clickerCodes = [
            clickerLeftButton,
            clickerRightButton,
            clickerUpButton,
            clickerDownButton,
        ];

        if (e.code && clickerCodes.indexOf(e.code) > -1) {
            e.stopPropagation();
            e.preventDefault();
            switch (clickerCodes.indexOf(e.code)) {
                case 0:
                    clickerLeftButtonRef.current?.click();
                    break;
                case 1:
                    clickerRightButtonRef.current?.click();
                    break;
                case 2:
                    clickerUpButtonRef.current?.click();
                    break;
                case 3:
                    clickerDownButtonRef.current?.click();
                    break;
            }
        }
    }

    const handleKeyHoldEvent = (e: any) => {

        let clickerCodes = [
            clickerLeftButton,
            clickerRightButton,
            clickerUpButton,
            clickerDownButton,
        ];

        if (e.code && clickerCodes.indexOf(e.code) > -1) {
            e.stopPropagation();
            e.preventDefault();
            switch (clickerCodes.indexOf(e.code)) {
                case 0:
                    clickerLeftHoldButtonRef.current?.click();
                    break;
                case 1:
                    clickerRightHoldButtonRef.current?.click();
                    break;
                case 2:
                    clickerUpHoldButtonRef.current?.click();
                    break;
                case 3:
                    clickerDownHoldButtonRef.current?.click();
                    break;
            }
        }
    }

    useKeyPress(
        () => handleKeyDownEvent(),
        (e: KeyboardEvent) => handleKeyUpEvent(e),
        (e: KeyboardEvent) => handleKeyHoldEvent(e),
        {
            longpressDelay: clickerLongpressTimeout,
            ignoreTypingDelay: clickerIgnoreTypingDelay,
            suppressKeyDefaults: clickerSuppressKeyDefaults,
        }
    );

    useEffect(() => {
        if (currentPlaylist !== null && currentPlaylist.songs.length > 0) {
            if (publishedSong?.id ?? 0 < 1) {
                // opening the playlist for the first time
                setOpenSong(currentPlaylist.songs[0]);
                setPublishedSlide(PlaylistSlideType.start);
                setNextSlide(currentPlaylist.songs[0].slides[0]);
            }
        }
    }, [currentPlaylist]);

    useEffect(() => {
        if (openSong?.id) {
            if (typeof publishedSlide === 'object' && publishedSlide.id < 1) {
                if (openSong.slides.length > 0) {
                    setPublishedSlide(openSong.slides[0]);
                }
                if (openSong.slides.length > 1) {
                    // queue next slide
                    setNextSlide(openSong.slides[1]);
                } else {
                    // queue slide from next song
                    let currentSongIndex = currentPlaylist?.songs.map((song: Song) => song.id).indexOf(publishedSong.id) ?? -1;
                    let _nextSong = currentPlaylist?.songs.filter((song: Song, songIndex: number) => songIndex > currentSongIndex && song.slides.length > 0)[0];
                    if (_nextSong !== undefined) {
                        setNextSong(_nextSong);
                    }
                }
            }
        }
    }, [publishedSong]);

    useEffect(() => {
        if (nextSong) {
            if (nextSong.slides.length > 0) {
                if (false === nextSlide instanceof Object || nextSong.id !== nextSlide?.songId) {
                    setNextSlide(nextSong.slides[0]);
                }
                setOpenSong(nextSong);
            }
        }
    }, [nextSong]);

    useEffect(() => {
        if (currentPlaylist && openSong) {
            if (openSong.slides.length > 0) {
                setNextSlide(openSong.slides[0] as Slide);
            } else {
                setNextSlide(PlaylistSlideType.end);
            }
        }
    }, [openSong]);

    useEffect(() => {
        if (currentPlaylist && nextSlide instanceof Object) {
            if (nextSong && nextSlide.songId !== nextSong.id) {
                let _nextSong = currentPlaylist.songs.filter((song: Song) => song.id === nextSlide.songId)[0];
                if (_nextSong) {
                    if (_nextSong.id !== publishedSong.id) {
                        setNextSong(_nextSong);
                        setOpenSong(_nextSong);
                    }
                }
            }
        }
    }, [nextSlide]);

    useEffect(() => {

        if (currentPlaylist !== null) {

            if (publishedSlide === 'end') {

                LiveSocket.emit('changeSlide', { slide: 'endSlide', slideContent: currentPlaylist.endSlide, slideType: '' });
                setPublishedSong(defaultSong);
                setNextSong(defaultSong);

            } else if (publishedSlide === 'start') {
                LiveSocket.emit('changeSlide', { slide: 'startSlide', slideContent: currentPlaylist.startSlide, slideType: '' });
                setPublishedSong(defaultSong);
                setNextSong(currentPlaylist.songs[0] ?? defaultSong);

            } else if (typeof publishedSlide === 'object') {

                LiveSocket.emit('changeSlide', { slide: publishedSlide });

                if (publishedSlide.songId !== publishedSong.id) {
                    let slideSong = currentPlaylist.songs.filter((song: Song) => song.id === publishedSlide.songId)[0];
                    setPublishedSong(slideSong);
                    setOpenSong(slideSong);

                    let currentSlideIndex = slideSong.slides.map((slide: Slide) => slide.id).indexOf(publishedSlide.id);
                    let nextSlideIndex = currentSlideIndex + 1;

                    if (nextSlideIndex < slideSong.slides.length) {
                        setNextSlide(slideSong.slides[nextSlideIndex]);
                    } else {
                        let currentSongIndex = currentPlaylist.songs.filter((song: Song) => song.slides.length > 0).map((song: Song) => song.id).indexOf(slideSong.id);
                        let nextSongIndex = currentSongIndex + 1;
                        let nextSong = currentPlaylist.songs.filter((song: Song) => song.slides.length > 0)[nextSongIndex];
                        if (nextSong) {
                            setNextSong(nextSong);
                            setOpenSong(nextSong);
                            setNextSlide(nextSong.slides[0]);
                        }
                    }
                }

                // scroll the next slide into view, if it is outside of the viewport

                let currentSlideIndex = publishedSong.slides.map((slide: Slide) => slide.id).indexOf(publishedSlide.id);
                let nextSlideIndex = currentSlideIndex + 1;

                if (nextSlideIndex < (publishedSong.slides.length)) {
                    let _nextSlide = publishedSong.slides[nextSlideIndex];

                    let publishedSlideEl = document.getElementById('published-song-slide-' + publishedSlide.id);
                    let nextSlideEl = document.getElementById('published-song-slide-' + _nextSlide.id);
                    let slidesContainerEl = document.getElementById('published-slides-container');
                    slidesContainerEl?.scrollTo({
                        top: (publishedSlideEl?.offsetTop ?? nextSlideEl?.offsetTop ?? slidesContainerEl.scrollTop) - 20
                    });
                }
            }
        }
    }, [publishedSlide]);

    useEffect(() => {
        if (currentPlaylist) {
            if (isPaused) {
                LiveSocket.emit('changeSlide', { slide: 'pauseSlide', slideContent: currentPlaylist.pauseSlide, slideType: '' });
            } else {
                emitCurrentSlide();
            }
        }
    }, [isPaused]);

    useEffect(() => {
        const searchParamsId = params.playlistId ?? null;
        if (searchParamsId) {
            loadPlaylistById(parseInt(searchParamsId));
        }
        LiveSocket.on('requestCurrentSlide', (payload) => {
            switch (payload.requestor) {
                case 'audience':
                    if (currentPlaylist) {
                        if (isPaused) {
                            LiveSocket.emit('changeSlide', { slide: 'pauseSlide', slideContent: currentPlaylist.pauseSlide, slideType: '' });
                        } else {
                            emitCurrentSlide();
                        }
                    }
                    break;
            }
        });
    }, []);

    const emitCurrentSlide = () => {
        if (currentPlaylist) {
            switch (publishedSlide) {
                case 'start':
                    LiveSocket.emit('changeSlide', { slide: 'startSlide', slideContent: currentPlaylist.startSlide, slideType: '' });
                    break;
                case 'pause':
                    LiveSocket.emit('changeSlide', { slide: 'pauseSlide', slideContent: currentPlaylist.pauseSlide, slideType: '' });
                    break;
                case 'end':
                    LiveSocket.emit('changeSlide', { slide: 'endSlide', slideContent: currentPlaylist.endSlide, slideType: '' });
                    break;
                default:
                    LiveSocket.emit('changeSlide', { slide: publishedSlide });
            }
        }
    }

    const SongTile = function (props: songTilePropsInterface) {
        props = { ...songTilePropsDefaults, ...props };

        const song = props.song;
        const _publishedSong = props.publishedSong;
        const _nextSong = props.nextSong;

        const classNames = ['song-tile-container', props.className];

        if (_publishedSong.id === song.id) {
            classNames.push('published-song');
        } else if (_nextSong && _nextSong.id == song.id) {
            classNames.push('next-song');
        }

        return <>
            {song && <div key={props.key} className={classNames.join(' ')} id={`songlist-song-${song.id}`}>
                <Tile noDragHandle
                    onClick={() => props.setNextSong(song)}>
                    <span className="status-icons">
                        <span className="status-icon published"><i className="pi pi-sun"></i> Live!</span>
                        <span className="status-icon next"><i className="pi pi-flag"></i> Next</span>
                    </span>
                    <div className="song-content"
                        dangerouslySetInnerHTML={{ __html: song.name }} />
                </Tile>
            </div>}
        </>
    }

    const SlideTile = function (props: slideTilePropsInterface) {
        props = { ...slideTilePropsDefaults, ...props };

        let slide = props.slide;
        let _publishedSlide = props.publishedSlide;
        let _nextSlide = props.nextSlide;

        const classNames = ['slide-tile-container', props.className];

        if (typeof _publishedSlide === 'object' && _publishedSlide.id === slide.id) {
            classNames.push('published-slide');
        }

        if (_nextSlide instanceof Object && _nextSlide?.id == slide.id) {
            classNames.push('next-slide');
        }

        return <>
            <div key={props.key} className={classNames.join(' ')} id={`published-song-slide-${slide.id}`}>
                <Tile noDragHandle
                    onClick={() => props.setNextSlide(slide)}>
                    <span className="slide-id">{slide.name}</span>
                    <span className="slide-type">
                        <span title={SlideTypeLabels[slide.type]} className={`slide-type-name ${SlideTypeClassNames[slide.type]}`}>{SlideTypeLabels[slide.type]}</span>
                    </span>
                    <span className="status-icons">
                        <span className="status-icon published"><i className="pi pi-sun"></i> Live!</span>
                        <span className="status-icon next"><i className="pi pi-flag"></i> Next</span>
                    </span>
                    <div className="slide-content"
                        dangerouslySetInnerHTML={{ __html: slide.content }} />
                </Tile>
            </div>
        </>
    }

    return <>
        {currentPlaylist
            ?
            <PlainLayout>
                <Dialog visible={showConfig} onHide={() => setShowConfig(false)}>
                    <AudienceScreenConfig />
                </Dialog >
                <div>
                    {isPortrait && <div className="display-block text-center">
                        <h2 className="">Ermmm, just need your help with this...</h2>
                        <img className="" src="/images/vecteezy_full-screen-vector-icon-design_25964485_482/vecteezy_full-screen-vector-icon-design_25964485-scaled.jpg"
                            alt="Picture of a Movie in Fullscreen" width="300" height="280" />
                        <p className="text-xl">This app is only designed to work in landscape orientation,<br />
                            could you turn the screen on it's side please? ...thanks!
                        </p>
                    </div>}

                    {isLandscape && <div className="songleader-sing">

                        <div className="songs-section">
                            <div className={`songs-container ${(clickerPosition === 'songs' ? 'clicker-focus' : '')}`} id="songlist-songs-drawer">
                                {(currentPlaylist.songs.length < 1)
                                    ?
                                    <div className="flex flex-column justify-content-center h-full w-full">
                                        <p className="text-center">Selected Playlist does not have any songs</p>
                                    </div>
                                    :
                                    <>
                                        <div key={`startSlide`} className={`song-tile-container ${publishedSlide === PlaylistSlideType.start && 'published-song'} ${nextSlide === PlaylistSlideType.start && 'next-song'}`} id={`songlist-song-start-slide`}>
                                            <Tile noDragHandle
                                                onClick={() => setPublishedSlide(PlaylistSlideType.start)}>
                                                <span className="status-icons">
                                                    <span className="status-icon published"><i className="pi pi-sun"></i> Live!</span>
                                                    <span className="status-icon next"><i className="pi pi-flag"></i> Next</span>
                                                </span>
                                                <div className="song-content">Start Slide</div>
                                            </Tile>
                                        </div>
                                        {currentPlaylist && currentPlaylist.songs.map((song: Song) =>
                                            <SongTile
                                                className={`${(clickerFocusedSong?.id === song.id ? 'clicker-focus' : '')}`}
                                                key={song.id}
                                                song={song}
                                                publishedSong={publishedSong}
                                                nextSong={nextSong}
                                                setNextSong={() => setOpenSong(song)}
                                            />
                                        )}
                                        <div key={`endSlide`} className={`song-tile-container ${publishedSlide === PlaylistSlideType.end && 'published-song'} ${nextSlide === PlaylistSlideType.end && 'next-song'}`} id={`songlist-song-end-slide`}>
                                            <Tile noDragHandle
                                                onClick={() => setPublishedSlide(PlaylistSlideType.end)}>
                                                <span className="status-icons">
                                                    <span className="status-icon published"><i className="pi pi-sun"></i> Live!</span>
                                                    <span className="status-icon next"><i className="pi pi-flag"></i> Next</span>
                                                </span>
                                                <div className="song-content">End Slide</div>
                                            </Tile>
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                        <div className={`slides-section ${(clickerPosition === 'slides' ? 'clicker-focus' : '')}`} id="published-slides-container">
                            <h2>Slides from Current Song</h2>
                            <div className="slides-container" id="published-slides-drawer">
                                {(openSong && openSong.slides.length < 1) && <div className="flex flex-column justify-content-center h-full w-full">
                                    <p className="text-center">Selected Song does not have any slides</p>
                                </div>}
                                {openSong && openSong.slides.map((slide: Slide) =>
                                    <SlideTile
                                        className={`${(clickerFocusedSlide?.id === slide.id ? 'clicker-focus' : '')}`}
                                        key={slide.id}
                                        slide={slide}
                                        publishedSlide={publishedSlide}
                                        nextSlide={nextSlide}
                                        setNextSlide={setNextSlide}
                                    />
                                )}
                            </div>
                        </div>
                        <div className={`live-section ${(clickerPosition === 'live' ? 'clicker-focus' : '')}`}>
                            <div className="published-slide">
                                <h2>Current Slide</h2>
                                <div className="slide-content-container">
                                    <div className="slide-content"
                                        dangerouslySetInnerHTML={{ __html: getPublishedSlideContent() ?? '' }} />
                                </div>
                            </div>
                            <div className="next-slide" onClick={playNextSlide}>
                                <h2>Next Slide</h2>
                                <div className="slide-content-container">
                                    <div className="slide-content"
                                        dangerouslySetInnerHTML={{ __html: getNextSlideContent() }} />
                                </div>
                            </div>
                            <div className="clicker-buttons grid">
                                <div className="col-6">
                                    <div className="clickerLeftButton" ref={clickerLeftButtonRef} onClick={() => handleLeftButtonPress()}></div>
                                    <div className="clickerRightButton" ref={clickerRightButtonRef} onClick={() => handleRightButtonPress()}></div>
                                    <div className="clickerUpButton" ref={clickerUpButtonRef} onClick={() => handleUpButtonPress()}></div>
                                    <div className="clickerDownButton" ref={clickerDownButtonRef} onClick={() => handleDownButtonPress()}></div>
                                </div>
                                <div className="col-6">
                                    <div className="clickerLeftHoldButton" ref={clickerLeftHoldButtonRef} onClick={() => handleLeftButtonHold()}></div>
                                    <div className="clickerRightHoldButton" ref={clickerRightHoldButtonRef} onClick={() => handleRightButtonHold()}></div>
                                    <div className="clickerUpHoldButton" ref={clickerUpHoldButtonRef} onClick={() => handleUpButtonHold()}></div>
                                    <div className="clickerDownHoldButton" ref={clickerDownHoldButtonRef} onClick={() => handleDownButtonHold()}></div>
                                </div>
                            </div>
                            <div className="actions">
                                <div className="action-buttons">
                                    <Button className={`pause-button ${isPaused && 'paused'}`} onClick={() => setIsPaused(!isPaused)}>{isPaused ? 'Paused' : 'Pause'}</Button>
                                    {/* @TODO: Ability to load an impromptu song 
                                <Button>Song</Button> */}
                                    {/* @TODO: Ability to load a bible verse
                                <Button>Verse</Button> */}
                                    {/* @TODO: Ability to type directly onto the screen
                                <Button>Type</Button> */}
                                    <Button className={`config-button`} onClick={() => setShowConfig(true)}>Config</Button>
                                    <Button className={`exit-button`} onClick={exitScreen} severity={ButtonSeverity.danger}>Exit</Button>
                                </div>
                            </div>
                        </div>
                    </div>}
                </div>
            </PlainLayout>
            :
            <GasLayout>
                <PlaylistPicker onEdit={(playlist: Playlist) => navigate('/songleader/plan/' + playlist.id)} onPlay={(playlist: Playlist) => setCurrentPlaylist(playlist)} />
            </GasLayout>
        }
    </>
}

export default withOrientationChange(Sing);

