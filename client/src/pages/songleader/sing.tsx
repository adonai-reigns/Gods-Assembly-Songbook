import { useState, useEffect, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { withOrientationChange } from 'react-device-detect';
import { getApiUrl, getLiveSocket } from '../../stores/server';
import { get, isEmpty, isObject, isUndefined } from "lodash";
import axios from "axios";

import { Dialog } from "primereact/dialog";

import { RemoteClicker, ClickerButton } from "../../components/RemoteClicker";
import { PlaylistPicker } from "../../components/PlaylistPicker";
import { Button, ButtonSeverity } from '../../components/Button';
import { Tile } from "../../components/Tile";

import { Playlist } from "../../models/playlist";
import { Song } from "../../models/song";
import { SlideTypeClassNames, SlideTypeLabels } from "../../models/slide";
import { PlaylistPlayer, SongPlayer, SlidePlayer } from "../../models/playlistPlayer";
import { PlaylistPlayerSocket, PlaylistPlayerSocketEvent } from '../../utilities/playlistPlayerSocket';

import AudienceScreenConfig from "../admin/audience-screen-config";

import PlainLayout from "../../layouts/PlainLayout";
import GasLayout from "../../layouts/GasLayout";

import { getSettingValue } from "../../stores/settings";
import { getPlaylistPlayer, setPlaylistPlayer } from "../../stores/playlist";

import "./sing.scss";
import { useStore } from "@nanostores/react";

interface propsInterface {
    className?: string;
    isLandscape?: boolean;
    isPortrait?: boolean;
}

const propsDefaults = {
    className: ''
}

interface slideTilePropsInterface {
    key: any;
    className?: string;
    slide: SlidePlayer;
}

const slideTilePropsDefaults = {
    className: ''
}

interface songTilePropsInterface {
    key: any;
    className?: string;
    song: SongPlayer;
}

const songTilePropsDefaults = {
    className: ''
}

enum PlaylistSlideType {
    start = 'start',
    pause = 'pause',
    end = 'end'
}

const Sing = function (props: propsInterface) {

    props = { ...propsDefaults, ...props };

    const playlistPlayer = useStore(getPlaylistPlayer());

    const LiveSocket = getLiveSocket();
    const apiUrl = getApiUrl();

    const params = useParams();
    const navigate = useNavigate();

    const isPortrait = props.isPortrait ?? false;
    const isLandscape = !isPortrait;

    const defaultSlide = {} as SlidePlayer;
    defaultSlide.name = defaultSlide.content = '';

    const defaultSong = new SongPlayer(new Song({}), playlistPlayer);
    defaultSong.name = '';

    const [clickerPosition, setClickerPosition] = useState<'songs' | 'slides' | 'live'>('live');
    const [clickerFocusedSlide, setClickerFocusedSlide] = useState<SlidePlayer | 'start' | 'end' | undefined>();
    const [clickerFocusedSong, setClickerFocusedSong] = useState<SongPlayer | undefined>();

    const [playlistSocket, setPlaylistSocket] = useState<PlaylistPlayerSocket>();
    const [currentPlaylist, setCurrentPlaylist] = useState<Playlist>(new Playlist({}));

    const [, forceRepaint] = useReducer(x => x + 1, 0);

    const [showConfig, setShowConfig] = useState<boolean>(false);

    const exitScreen = () => {
        if (confirm('Are you sure?')) {
            setPlaylistPlayer({});
            LiveSocket.emit('exitPlaylist', { playlist: new Playlist(currentPlaylist) });
            navigate('/songleader');
        }
    }

    const loadPlaylistById = (playlistId: number): Playlist | void => {
        axios.get(apiUrl + '/playlists/' + playlistId).then((response: any) => {
            setCurrentPlaylist(new Playlist(response.data));
        });
    }

    const handlePlayerEvent = (event: PlaylistPlayerSocketEvent, args: any) => {
        let playlistPlayer = PlaylistPlayer.getInstance(currentPlaylist);
        switch (event) {
            case PlaylistPlayerSocketEvent.setIsStarting:
                setClickerFocusedSlide('start');
                break;
            case PlaylistPlayerSocketEvent.setIsEnded:
                setClickerFocusedSlide('end');
                break;
            case PlaylistPlayerSocketEvent.setCurrentSlide:
                let nextSlide = playlistPlayer.findNextSlide(args);
                if (isObject(nextSlide)) {
                    setClickerFocusedSlide(nextSlide);
                } else {
                    setClickerFocusedSlide('end');
                }
                scrollSongIntoView();
                break;
        }
    }

    const scrollClickerFocusIntoView = () => {
        setTimeout(() => {
            let songsContainerEl = document.querySelector('.songs-section') as HTMLElement;
            let focussedEl = document.querySelector('.songs-container .clicker-focus') as HTMLElement;
            let paddingTop = 20;
            let paddingBottom = 20;
            if (focussedEl) {
                if (focussedEl.offsetTop - songsContainerEl.scrollTop < 0) {
                    songsContainerEl.scrollTo({ top: focussedEl.offsetTop - paddingTop });
                } else if ((focussedEl.offsetTop + focussedEl.getBoundingClientRect().height) - songsContainerEl.scrollTop > songsContainerEl.clientHeight - paddingBottom) {
                    songsContainerEl.scrollTo({ top: focussedEl.offsetTop - (songsContainerEl.clientHeight - focussedEl.getBoundingClientRect().height) + paddingBottom });
                }
            }
        });
    }

    const scrollSongIntoView = () => {
        setTimeout(() => {
            let songsContainerEl = document.querySelector('.songs-section') as HTMLElement;
            let focussedEl = document.querySelector('.songs-container .published-song') as HTMLElement;
            let paddingTop = 20;
            let paddingBottom = 20;
            if (focussedEl) {
                if (focussedEl.offsetTop - songsContainerEl.scrollTop < 0) {
                    songsContainerEl.scrollTo({ top: focussedEl.offsetTop - paddingTop });
                } else if ((focussedEl.offsetTop + focussedEl.getBoundingClientRect().height) - songsContainerEl.scrollTop > songsContainerEl.clientHeight - paddingBottom) {
                    songsContainerEl.scrollTo({ top: focussedEl.offsetTop - (songsContainerEl.clientHeight - focussedEl.getBoundingClientRect().height) + paddingBottom });
                }
            }
            focussedEl = document.querySelector('.songs-container .next-song') as HTMLElement;
            if (focussedEl) {
                if (focussedEl.offsetTop - songsContainerEl.scrollTop < 0) {
                    songsContainerEl.scrollTo({ top: focussedEl.offsetTop - paddingTop });
                } else if ((focussedEl.offsetTop + focussedEl.getBoundingClientRect().height) - songsContainerEl.scrollTop > songsContainerEl.clientHeight - paddingBottom) {
                    songsContainerEl.scrollTo({ top: focussedEl.offsetTop - (songsContainerEl.clientHeight - focussedEl.getBoundingClientRect().height) + paddingBottom });
                }
            }
        });
    }

    const handleRemoteClickerButtonClick = (button: ClickerButton) => {
        switch (button) {
            case ClickerButton.rightButton:
                switch (clickerPosition) {
                    /**
                    * Clicking the right button on the live view will play the next slide
                    */
                    case 'live':
                        playlistPlayer.doPlayNextSlide();
                        break;

                    /**
                    * Clicking the right button on the slides view will move the clicker focus through the slides
                    */
                    case 'slides':
                        let nextSlide = playlistPlayer.findNextSlide(isObject(clickerFocusedSlide) ? clickerFocusedSlide as SlidePlayer : undefined);
                        if (!isEmpty(nextSlide)) {
                            if (nextSlide.getSong().id === (clickerFocusedSong ?? {} as SongPlayer).id) {
                                setClickerFocusedSlide(nextSlide);
                                // setClickerFocusedSong(nextSlide.getSong());
                            }
                        } else {
                            setClickerFocusedSlide(playlistPlayer.getSlides()[0]);
                            setClickerFocusedSong(playlistPlayer.getSlides()[0].getSong());
                        }
                        break;

                    /**
                    * Clicking the right button on the songs view will move the clicker focus through the songs
                    */
                    case 'songs':
                        let nextSong;
                        if (isUndefined(clickerFocusedSong)) {
                            if (clickerFocusedSlide === 'start') {
                                // select the first song as the focus target
                                nextSong = playlistPlayer.getSongs()[0];
                            }
                        } else {
                            // set focus on the next song
                            nextSong = playlistPlayer.getNextSong(clickerFocusedSong);

                        }
                        if (!isUndefined(nextSong)) {
                            setClickerFocusedSong(nextSong as SongPlayer);
                            if (clickerFocusedSlide === 'start') {
                                // unfocus the start slide
                                setClickerFocusedSlide(undefined);
                            }
                        } else {
                            // set focus on the end slide and unfocus the current song
                            setClickerFocusedSong(undefined);
                            setClickerFocusedSlide('end');
                        }
                        scrollClickerFocusIntoView();
                        break;
                }
                break;

            case ClickerButton.leftButton:
                switch (clickerPosition) {
                    /**
                    * Clicking the left button on the live view will play the previous slide
                    */
                    case 'live':
                        playlistPlayer.doPlayPreviousSlide();
                        break;

                    /**
                    * Clicking the left button on the slides view will move the clicker focus through the slides
                    */
                    case 'slides':
                        let previousSlide = playlistPlayer.findPreviousSlide(isObject(clickerFocusedSlide) ? clickerFocusedSlide as SlidePlayer : undefined);
                        if (!isEmpty(previousSlide)) {
                            if (previousSlide.getSong().id === (clickerFocusedSong ?? {} as SongPlayer).id) {
                                setClickerFocusedSlide(previousSlide);
                            }
                        }
                        break;

                    /**
                    * Clicking the left button on the songs view will move the clicker focus through the songs
                    */
                    case 'songs':
                        let prevSong;
                        if (isUndefined(clickerFocusedSong)) {
                            if (clickerFocusedSlide === 'end') {
                                // select the last song as the focus target
                                prevSong = playlistPlayer.getSongs()[playlistPlayer.getSongs().length - 1];
                                // unfocus the end slide
                                setClickerFocusedSlide(undefined);
                            }
                        } else {
                            // set focus on the previous song
                            prevSong = playlistPlayer.getPreviousSong(clickerFocusedSong) ?? undefined;
                        }
                        if (!isUndefined(prevSong)) {
                            setClickerFocusedSong(prevSong as SongPlayer);
                        } else {
                            // set focus on the start slide and unfocus the current song
                            setClickerFocusedSlide('start');
                            setClickerFocusedSong(undefined);
                        }
                        scrollClickerFocusIntoView();
                        break;
                }
                break;

            case ClickerButton.downButton:
                switch (clickerPosition) {
                    case 'slides':
                        setClickerPosition('live');
                        break;
                    case 'songs':
                        setClickerPosition('slides');
                        break;
                    case 'live':
                    default:
                        setClickerPosition('songs');
                        break;
                }
                break;

            case ClickerButton.upButton:
                switch (clickerPosition) {
                    case 'slides':
                        setClickerPosition('songs');
                        break;
                    case 'live':
                        setClickerPosition('slides');
                        break;
                    case 'songs':
                    default:
                        setClickerPosition('live');
                        break;
                }
                break;

        }
        forceRepaint();
    }

    const handleRemoteClickerButtonLongPress = (button: ClickerButton) => {
        switch (button) {
            case ClickerButton.leftButton:
                /**
                 * Holding-down the left button toggles pause on/off
                 */
                playlistPlayer.doTogglePause();
                break;

            case ClickerButton.rightButton:
                switch (clickerPosition) {
                    case 'live':

                        /**
                         * Holding-down the right button in the live view will unpause and plays the next slide, if it is currently paused
                         */
                        if (playlistPlayer.isPaused()) {
                            playlistPlayer.doUnpause();
                            playlistPlayer.doPlayNextSlide();
                        } else {
                            /**
                             * Holding-down the right button in the live view will play the next song, if it is not currently paused
                             */
                            let nextSong;
                            if (nextSong = playlistPlayer.getNextSong()) {
                                playlistPlayer.doPlaySong(nextSong);
                            } else {
                                playlistPlayer.doEnd();
                            }
                        }
                        break;

                    case 'slides':
                        if (playlistPlayer.isPaused()) {
                            /**
                             * Holding-down the right button in the slides view will set the focussed slide as the next slide, if it is paused
                             */
                            switch (clickerFocusedSlide) {
                                case undefined:
                                    break;
                                case 'start':
                                    playlistPlayer.doQueueStart();
                                    break;
                                case 'end':
                                    playlistPlayer.doQueueEnd();
                                    break;
                                default:
                                    playlistPlayer.doQueueSlide(clickerFocusedSlide);
                            }

                        } else {
                            /**
                             * Holding-down the right button in the slides view will set the focussed slide as the published slide, if it is not paused
                             */
                            switch (clickerFocusedSlide) {
                                case undefined:
                                    break;
                                case 'start':
                                    playlistPlayer.doStart();
                                    break;
                                case 'end':
                                    playlistPlayer.doEnd();
                                    break;
                                default:
                                    playlistPlayer.doPlaySlide(clickerFocusedSlide);

                            }

                        }
                        break;

                    case 'songs':
                        if (playlistPlayer.isPaused()) {
                            /**
                             * Holding-down the right button in the songs view will set the focussed song as the next song, if it is paused
                             */
                            if (!isUndefined(clickerFocusedSong)) {
                                playlistPlayer.doQueueSong(clickerFocusedSong);
                                setClickerFocusedSlide(clickerFocusedSong.getSlides()[0]);
                            }
                        } else {
                            /**
                             * Holding-down the right button in the songs view will set the focussed song as the published song, if it is not paused
                             */
                            if (!isUndefined(clickerFocusedSong)) {
                                playlistPlayer.doPlaySong(clickerFocusedSong);
                                setClickerFocusedSlide(clickerFocusedSong.getSlides()[0]);
                                setClickerPosition('live');

                            }
                        }
                        break;

                }
                break;

        }
        forceRepaint();
    }

    useEffect(() => {
        if (currentPlaylist !== null && currentPlaylist?.id) {
            if (isUndefined(playlistPlayer) || playlistPlayer.id !== currentPlaylist.id) {
                let _playlistPlayer = PlaylistPlayer.getInstance(currentPlaylist);
                setPlaylistPlayer(_playlistPlayer);

                _playlistPlayer.registerEventListener(PlaylistPlayerSocketEvent.setCurrentSlide, (args: any) => handlePlayerEvent(PlaylistPlayerSocketEvent.setCurrentSlide, args));
                _playlistPlayer.registerEventListener(PlaylistPlayerSocketEvent.setIsStarting, (args: any) => handlePlayerEvent(PlaylistPlayerSocketEvent.setIsStarting, args));
                _playlistPlayer.registerEventListener(PlaylistPlayerSocketEvent.setIsEnded, (args: any) => handlePlayerEvent(PlaylistPlayerSocketEvent.setIsEnded, args));

                if (!playlistSocket) {
                    let playlistPlayerSocket = new PlaylistPlayerSocket(LiveSocket);
                    playlistPlayerSocket.initListeners(_playlistPlayer);
                    setPlaylistSocket(playlistPlayerSocket);
                }
                _playlistPlayer.doStart();
            }
        }
    }, [currentPlaylist]);

    useEffect(() => {
        if (params.playlistId) {
            loadPlaylistById(parseInt(params.playlistId));
        }
    }, []);

    const SongTile = function (props: songTilePropsInterface) {

        props = { ...songTilePropsDefaults, ...props };

        const song = props.song;

        const classNames = ['song-tile-container', props.className];

        if (playlistPlayer.getCurrentSong()?.id === song.id) {
            classNames.push('published-song');
        } else if (playlistPlayer.getNextSong()?.id == song.id) {
            classNames.push('next-song');
        }

        return <>
            {song && <div key={props.key} className={classNames.join(' ')} id={`songlist-song-${song.id}`}>
                <Tile noDragHandle
                    onClick={() => (playlistPlayer.doQueueSong(song), forceRepaint())}>
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

        const classNames = ['slide-tile-container', props.className];

        if (isObject(playlistPlayer.getCurrentSlide()) && playlistPlayer.getCurrentSlide()?.id === slide.id) {
            classNames.push('published-slide');
        }

        if (get(playlistPlayer.getNextSlide(), 'id') === slide.id) {
            classNames.push('next-slide');
        }

        return <>
            <div key={props.key} className={classNames.join(' ')} id={`published-song-slide-${slide.id}`}>
                <Tile noDragHandle
                    onClick={() => (playlistPlayer.doQueueSlide(slide), forceRepaint())}>
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
        {playlistPlayer.id
            ?
            <PlainLayout>
                <Dialog visible={showConfig} onHide={() => setShowConfig(false)}>
                    <AudienceScreenConfig />
                </Dialog >
                <div>
                    {isPortrait && <div className="display-block text-center">
                        <h2>Ermmm, just need your help with this...</h2>
                        <img src="/images/vecteezy_full-screen-vector-icon-design_25964485_482/vecteezy_full-screen-vector-icon-design_25964485-scaled.jpg"
                            alt="Picture of a Movie in Fullscreen" width="300" height="280" />
                        <p className="text-xl">This app is only designed to work in landscape orientation,<br />
                            could you turn the screen on it's side please? ...thanks!
                        </p>
                    </div>}

                    {isLandscape && <div className="songleader-sing">

                        <div className="songs-section">
                            <div className={`songs-container ${(clickerPosition === 'songs' ? 'clicker-focus' : '')}`} id="songlist-songs-drawer">
                                {(isEmpty(playlistPlayer) || playlistPlayer.getSongs().length < 1)
                                    ?
                                    <div className="flex flex-column justify-content-center h-full w-full">
                                        <p className="text-center">Selected Playlist does not have any songs</p>
                                    </div>
                                    :
                                    <>
                                        <div key={`startSlide`}
                                            className={`song-tile-container ${playlistPlayer.isStarting() && 'published-song'} ` +
                                                `${playlistPlayer.getNextSlide() === PlaylistSlideType.start && 'next-song'} ` +
                                                `${(clickerFocusedSlide === 'start' ? 'clicker-focus' : '')}`}
                                            id={`songlist-song-start-slide`}>

                                            <Tile noDragHandle
                                                onClick={() => (playlistPlayer.doStart(), forceRepaint())}>
                                                <span className="status-icons">
                                                    <span className="status-icon published"><i className="pi pi-sun"></i> Live!</span>
                                                    <span className="status-icon next"><i className="pi pi-flag"></i> Next</span>
                                                </span>
                                                <div className="song-content">Start Slide</div>
                                            </Tile>

                                        </div>

                                        {!isEmpty(playlistPlayer) && playlistPlayer.getSongs().map((song: SongPlayer) =>
                                            <SongTile
                                                className={`${(clickerFocusedSong?.id === song.id ? 'clicker-focus' : '')}`}
                                                key={song.id}
                                                song={song}
                                            />
                                        )}

                                        <div key={`endSlide`}
                                            className={
                                                `song-tile-container ${playlistPlayer.isEnded() && 'published-song'} ` +
                                                `${playlistPlayer.getNextSlide() === PlaylistSlideType.end && 'next-song'} ` +
                                                `${(clickerFocusedSlide === 'end' ? 'clicker-focus' : '')}`}
                                            id={`songlist-song-end-slide`}>

                                            <Tile noDragHandle
                                                onClick={() => (playlistPlayer.doQueueEnd(), forceRepaint())}>
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
                                {(!isObject(playlistPlayer.getNextSlide()) || ((playlistPlayer.getNextSlide() as SlidePlayer)?.getSong()?.getSlides().length ?? 0) < 1)
                                    ?
                                    <div className="flex flex-column justify-content-center h-full w-full">
                                        <p className="text-center">Selected Song does not have any slides</p>
                                    </div>
                                    :
                                    <>
                                        {(playlistPlayer.getNextSlide() as SlidePlayer)?.getSong()?.getSlides().map((slide: SlidePlayer) =>
                                            <SlideTile
                                                className={`${(isObject(clickerFocusedSlide) && clickerFocusedSlide?.id === slide.id ? 'clicker-focus' : '')}`}
                                                key={slide.id}
                                                slide={slide}
                                            />
                                        )}
                                    </>
                                }
                            </div>
                        </div>

                        <div className={`live-section ${(clickerPosition === 'live' ? 'clicker-focus' : '')}`}>
                            <div className="published-slide">
                                <h2>Current Slide</h2>
                                <div className="slide-content-container">
                                    {playlistPlayer.isPaused()
                                        ? <div className="slide-content"
                                            dangerouslySetInnerHTML={{ __html: playlistPlayer.pauseSlide }} />
                                        : playlistPlayer.isStarting()
                                            ? <div className="slide-content"
                                                dangerouslySetInnerHTML={{ __html: playlistPlayer.startSlide }} />
                                            : playlistPlayer.isEnded()
                                                ? <div className="slide-content"
                                                    dangerouslySetInnerHTML={{ __html: playlistPlayer.endSlide }} />
                                                : <div className="slide-content"
                                                    dangerouslySetInnerHTML={{ __html: (playlistPlayer.getCurrentSlide() as SlidePlayer)?.content ?? 'loading....' }} />
                                    }
                                </div>
                            </div>

                            <div className="next-slide" onClick={() => (playlistPlayer.doPlayNextSlide(), forceRepaint())}>
                                <h2>Next Slide</h2>
                                <div className="slide-content-container">
                                    {playlistPlayer.getNextSlide() === 'start'
                                        ?
                                        <div className="slide-content"
                                            dangerouslySetInnerHTML={{ __html: playlistPlayer.startSlide }} />
                                        : playlistPlayer.getNextSlide() === 'end'
                                            ? <div className="slide-content"
                                                dangerouslySetInnerHTML={{ __html: playlistPlayer.endSlide }} />
                                            : <div className="slide-content"
                                                dangerouslySetInnerHTML={{ __html: (playlistPlayer.getNextSlide() as SlidePlayer)?.content ?? 'loading....' }} />
                                    }
                                </div>
                            </div>

                            <RemoteClicker
                                leftButtonKeyCode={getSettingValue('clickerLeftButtonCharCode')}
                                rightButtonKeyCode={getSettingValue('clickerRightButtonCharCode')}
                                upButtonKeyCode={getSettingValue('clickerUpButtonCharCode')}
                                downButtonKeyCode={getSettingValue('clickerDownButtonCharCode')}
                                longpressTimeout={getSettingValue('clickerLongpressTimeout')}
                                ignoreTypingDelay={getSettingValue('clickerIgnoreTypingDelay')}
                                suppressKeyDefaults={getSettingValue('clickerSuppressKeyDefaults')}
                                onClick={handleRemoteClickerButtonClick}
                                onLongPress={handleRemoteClickerButtonLongPress}

                            />

                            <div className="actions">
                                <div className="action-buttons">
                                    <Button className={`pause-button ${playlistPlayer.isPaused() && 'paused'}`} onClick={() => playlistPlayer.isPaused() ? (playlistPlayer.doUnpause(), forceRepaint()) : (playlistPlayer.doPause(), forceRepaint())}>{playlistPlayer.isPaused() ? 'Paused' : 'Pause'}</Button>
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
                <PlaylistPicker onEdit={(playlist: Playlist) => navigate('/songleader/plan/' + playlist.id)} onPlay={(playlist: Playlist) => setCurrentPlaylist(playlist as PlaylistPlayer)} />
            </GasLayout>
        }
    </>
}

export default withOrientationChange(Sing);

