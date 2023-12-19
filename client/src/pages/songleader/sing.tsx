import { useState, useEffect } from "react";
import axios from "axios";
import LiveSocket from '../../components/live/LiveSocket';

import { withOrientationChange } from 'react-device-detect';

import { Dialog } from "primereact/dialog";

import AudienceScreenConfig from "../admin/audience-screen-config";

import PlaylistPicker from "../../components/PlaylistPicker";
import Button from '../../components/Button';
import Tile from "../../components/Tile";

import Slide, { SlideTypeClassNames, SlideTypeLabels } from "../../models/slide";
// import Slide from "../../models/slide";

import type { Playlist } from "../../models/playlist";
import Song from "../../models/song";

import "./sing.scss";
import PlainLayout from "../../layouts/PlainLayout";
import { useNavigate, useParams } from "react-router-dom";

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
    publishedSlide: Slide | "start" | "pause" | "end";
    nextSlide: Slide;
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
    nextSong: Song;
    setNextSong: CallableFunction;
}

export const songTilePropsDefaults = {
    className: ''
}

const Sing = function (props: propsInterface) {

    props = { ...propsDefaults, ...props };

    const params = useParams();
    const navigate = useNavigate();

    const url = new URL(window.location.href);
    const apiUrl = url.protocol + '//' + url.hostname + ':3000/api';

    const isPortrait = props.isPortrait ?? false;
    const isLandscape = !isPortrait;

    const defaultSlide = new Slide();
    defaultSlide.name = defaultSlide.content = '';

    const defaultSong = new Song();
    defaultSong.name = '';

    const [isPaused, setIsPaused] = useState<boolean>(false);

    const [showConfig, setShowConfig] = useState<boolean>(false);

    const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);

    const [publishedSlide, setPublishedSlide] = useState<Slide | "start" | "pause" | "end">(defaultSlide);
    const [nextSlide, setNextSlide] = useState<Slide>(defaultSlide);

    const [publishedSong, setPublishedSong] = useState<Song>(defaultSong);
    const [openSong, setOpenSong] = useState<Song>(defaultSong);
    const [nextSong, setNextSong] = useState<Song>(defaultSong);

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
            switch (publishedSlide) {
                case 'start':
                    return currentPlaylist.startSlide;
                case 'pause':
                    return currentPlaylist.pauseSlide;
                case 'end':
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

    const playNextSlide = () => {
        if (currentPlaylist) {
            if (nextSlide.id) {
                setPublishedSlide(nextSlide);
                let nextSlideIndex = publishedSong.slides.map((slide: Slide) => slide.id).indexOf(nextSlide.id);

                if (nextSlide.songId === publishedSong.id) {
                    if (nextSlideIndex + 1 === publishedSong.slides.length) {
                        // it's the last slide of the song
                        let currentSongIndex = currentPlaylist?.songs.map((song: Song) => song.id).indexOf(publishedSong.id) ?? -1;
                        if (currentSongIndex + 1 === currentPlaylist?.songs.length) {
                            // it's the last song of the playlist
                            setNextSlide(new Slide());
                            setPublishedSlide('end');
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
                        let nextSongIndex = currentPlaylist.songs.filter((song: Song) => song.slides.length > 0).map((song: Song) => song.id).indexOf(nextSlide.songId) + 1;
                        let nextSong = currentPlaylist.songs.filter((song: Song) => song.slides.length > 0)[nextSongIndex];
                        if (nextSong) {
                            setNextSong(nextSong);
                            setOpenSong(nextSong);
                            setNextSlide(nextSong.slides[0]);
                        }
                    }
                }
                if (isPaused) {
                    setIsPaused(false);
                }
            }
        }
    }

    const loadPlaylistById = (playlistId: number): Playlist | null => {
        axios.get(apiUrl + '/playlists/' + playlistId).then((response) => {
            setCurrentPlaylist(response.data as Playlist);
        });
        return null;
    }

    useEffect(() => {
        if (currentPlaylist !== null && currentPlaylist.songs.length > 0) {
            if (publishedSong?.id ?? 0 < 1) {
                // opening the playlist for the first time
                // setPublishedSong(currentPlaylist.songs[0]);
                setOpenSong(currentPlaylist.songs[0]);
                setPublishedSlide('start');
            }
        }
    }, [currentPlaylist]);

    useEffect(() => {
        if (openSong.id) {
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
                if (nextSong.id !== nextSlide.songId) {
                    setNextSlide(nextSong.slides[0]);
                }
                setOpenSong(nextSong);
            }
        }
    }, [nextSong]);

    useEffect(() => {
        if (currentPlaylist) {
            if (nextSlide.songId !== nextSong.id) {
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

                let nextSlideIndex = publishedSong.slides.map((slide: Slide) => slide.id).indexOf(publishedSlide.id) + 1;

                if (publishedSlide.songId !== publishedSong.id) {
                    let slideSong = currentPlaylist.songs.filter((song: Song) => song.id === publishedSlide.songId)[0];
                    setPublishedSong(slideSong);
                    setOpenSong(slideSong);

                    let nextSlideIndex = slideSong.slides.map((slide: Slide) => slide.id).indexOf(publishedSlide.id) + 1;
                    if (nextSlideIndex < slideSong.slides.length) {
                        setNextSlide(slideSong.slides[nextSlideIndex]);
                    } else {
                        let nextSongIndex = currentPlaylist.songs.filter((song: Song) => song.slides.length > 0).map((song: Song) => song.id).indexOf(slideSong.id) + 1;
                        let nextSong = currentPlaylist.songs.filter((song: Song) => song.slides.length > 0)[nextSongIndex];
                        if (nextSong) {
                            setNextSong(nextSong);
                            setOpenSong(nextSong);
                            setNextSlide(nextSong.slides[0]);
                        }
                    }
                }

                // scroll the next slide into view, if it is outside of the viewport

                if (nextSlideIndex < (publishedSong.slides.length)) {
                    let nextSlide = publishedSong.slides[nextSlideIndex];

                    let publishedSlideEl = document.getElementById('published-song-slide-' + publishedSlide.id);
                    let nextSlideEl = document.getElementById('published-song-slide-' + nextSlide.id);
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
    }, []);

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
        const publishedSong = props.publishedSong;
        const nextSong = props.nextSong;

        const classNames = ['song-tile-container'];

        if (publishedSong.id === song.id) {
            classNames.push('published-song');
        } else if (nextSong.id == song.id) {
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

        const slide = props.slide;
        const publishedSlide = props.publishedSlide;
        const nextSlide = props.nextSlide;

        const classNames = ['slide-tile-container'];

        if (typeof publishedSlide === 'object' && publishedSlide.id === slide.id) {
            classNames.push('published-slide');
        }

        if (nextSlide.id == slide.id) {
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

    return <PlainLayout>
        <Dialog visible={showConfig} onHide={() => setShowConfig(false)}>
            <AudienceScreenConfig />
        </Dialog >
        {currentPlaylist
            ?
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
                        <div className="songs-container" id="songlist-songs-drawer">
                            {(currentPlaylist.songs.length < 1)
                                ?
                                <div className="flex flex-column justify-content-center h-full w-full">
                                    <p className="text-center">Selected Playlist does not have any songs</p>
                                </div>
                                :
                                <>
                                    <div key={`startSlide`} className={`song-tile-container ${publishedSlide === 'start' && 'published-song'}`} id={`songlist-song-start-slide`}>
                                        <Tile noDragHandle
                                            onClick={() => setPublishedSlide('start')}>
                                            <span className="status-icons">
                                                <span className="status-icon published"><i className="pi pi-sun"></i> Live!</span>
                                            </span>
                                            <div className="song-content">Start Slide</div>
                                        </Tile>
                                    </div>
                                    {currentPlaylist.songs.map((song: Song) =>
                                        <SongTile
                                            key={song.id}
                                            song={song}
                                            publishedSong={publishedSong}
                                            nextSong={nextSong}
                                            setNextSong={() => setOpenSong(song)}
                                        />
                                    )}
                                    <div key={`endSlide`} className={`song-tile-container ${publishedSlide === 'end' && 'published-song'}`} id={`songlist-song-end-slide`}>
                                        <Tile noDragHandle
                                            onClick={() => setPublishedSlide('end')}>
                                            <span className="status-icons">
                                                <span className="status-icon published"><i className="pi pi-sun"></i> Live!</span>
                                            </span>
                                            <div className="song-content">End Slide</div>
                                        </Tile>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                    <div className="slides-section" id="published-slides-container">
                        <h2>Slides from Current Song</h2>
                        <div className="slides-container" id="published-slides-drawer">
                            {(openSong.slides.length < 1) && <div className="flex flex-column justify-content-center h-full w-full">
                                <p className="text-center">Selected Song does not have any slides</p>
                            </div>}
                            {openSong.slides.map((slide: Slide) =>
                                <SlideTile
                                    key={slide.id}
                                    slide={slide}
                                    publishedSlide={publishedSlide}
                                    nextSlide={nextSlide}
                                    setNextSlide={setNextSlide}
                                />
                            )}
                        </div>
                    </div>
                    <div className="live-section">
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
                                    dangerouslySetInnerHTML={{ __html: nextSlide.content }} />
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
                                <Button className={`exit-button`} onClick={exitScreen} severity="danger">Exit</Button>
                            </div>
                        </div>
                    </div>

                </div>}
            </div >
            :
            <>
                <PlaylistPicker onEdit={(playlist: Playlist) => navigate('/songleader/plan/' + playlist.id)} onPlay={(playlist: Playlist) => setCurrentPlaylist(playlist)} />
            </>

        }
    </PlainLayout>
}

export default withOrientationChange(Sing);

