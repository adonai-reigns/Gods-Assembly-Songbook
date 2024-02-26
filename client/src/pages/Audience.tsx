import { useEffect, useRef, useState } from 'react';
import { getApiUrl, getLiveSocket } from '../stores/server';
import { isEmpty } from 'lodash';
import axios from 'axios';

import { PlaylistPlayerSocketEvent } from '../utilities/playlistPlayerSocket';

import { Slide, SlideTypeLabels } from '../models/slide';
import { LineMarginUnits, LinePaddingUnits, PaddingSizesUnits, ScreenStyle, ScreenStyleComputed, TextSizesUnits } from '../models/screen';
import { Wallpaper, getMimeTypeFormat, MimeType, SlideLineStyle, WallpaperFile } from '../models/wallpaper';

import PlainLayout from '../layouts/PlainLayout';

import "./Audience.scss";
import 'animate.css';

interface propsInterface {
    className?: string;
    children?: any;
}

const propsDefaults = {
    className: '',
}

const Audience = function (props: propsInterface) {

    props = { ...propsDefaults, ...props };

    const LiveSocket = getLiveSocket();

    const apiUrl = getApiUrl();

    const [screenId] = useState<number>(1);
    const [assemblyWallpaperId] = useState<number>(1);

    const defaultWallpaper = new Wallpaper();

    const [wallpaper, setWallpaper] = useState<Wallpaper>(defaultWallpaper);
    const [wallpaperFile, setWallpaperFile] = useState<WallpaperFile | undefined>(undefined);
    const wallpaperCycleInterval = useRef<any>(null);

    const [slideContent, setSlideContent] = useState<string>('');
    const [slideType, setSlideType] = useState<string>('');
    const [screenStyleComputed, setScreenStyleComputed] = useState<ScreenStyleComputed>(new ScreenStyleComputed());

    const computeScreenStyle = (screenStyle: ScreenStyle): ScreenStyleComputed => {
        let newScreenStyleComputed = new ScreenStyleComputed();
        newScreenStyleComputed.audienceSlide.fontSize = TextSizesUnits[screenStyle.fontSize];
        newScreenStyleComputed.audienceSlide.linePadding = LinePaddingUnits[screenStyle.linePadding];
        newScreenStyleComputed.audienceSlide.lineMargin = LineMarginUnits[screenStyle.lineMargin];
        newScreenStyleComputed.audienceSlide.padding = PaddingSizesUnits[screenStyle.padding];
        newScreenStyleComputed.audienceSlide.textAlign = screenStyle.textAlign;
        newScreenStyleComputed.slideType.display = ((['true', true].indexOf(screenStyle.showSlideType) > -1) ? 'block' : 'none');
        return newScreenStyleComputed;
    }

    const loadAssemblyWallpaper = () => {
        axios.get(apiUrl + '/wallpapers/' + assemblyWallpaperId).then((response: any) => {
            if (response.data) {
                setWallpaper(response.data);
            }
        }).catch(() => { });
    }

    function onSetScreenStyle(payload: any) {
        if (payload.screen.id === screenId) {
            setScreenStyleComputed(computeScreenStyle(payload.screen.style));
        }
    }

    function onSetAssemblyWallpaper(payload: any) {
        if (payload.wallpaper.id === assemblyWallpaperId) {
            setWallpaper(payload.wallpaper);
        }
    }

    function onExitPlaylist() {
        let container = document.getElementById('audience-slide-container');
        if (container) {
            container.innerHTML = '';
        }
    }

    const cycleWallpaper = () => {
        setWallpaperFile((_wallpaperFile: WallpaperFile | undefined): WallpaperFile | undefined => {
            if (wallpaper.files.length > 0) {
                let currentFileIndex = -1;
                if (_wallpaperFile !== undefined) {
                    currentFileIndex = wallpaper.files.map((file: WallpaperFile) => file.filename).indexOf(_wallpaperFile.filename);
                }
                let nextFileIndex = currentFileIndex + 1;
                if (nextFileIndex > wallpaper.files.length - 1) {
                    nextFileIndex = 0;
                }
                let nextWallpaperFile = { ...wallpaper.files[nextFileIndex] } as WallpaperFile;
                return nextWallpaperFile;
            } else {
                return undefined;
            }
        });
    }

    useEffect(() => {
        if (wallpaper.id < 1) {
            return;
        }
        if (wallpaper.files.length > 0) {
            document.body.classList.add('has-wallpaper');
        } else {
            document.body.classList.remove('has-wallpaper');
        }
        if (wallpaperCycleInterval !== null) {
            clearInterval(wallpaperCycleInterval.current);
        }
        if (wallpaper.style.slideshowSpeed > 0) {
            wallpaperCycleInterval.current = setInterval(cycleWallpaper, wallpaper.style.slideshowSpeed * 1000);
        } else {
            setWallpaperFile(wallpaper.files[0] ?? undefined);
        }
    }, [wallpaper]);

    useEffect(() => {
        axios.get(apiUrl + '/screens/' + screenId).then((response: any) => {
            if (response.data) {
                setScreenStyleComputed(computeScreenStyle(response.data.style));
            }
        }).catch(() => { });
    }, [screenId]);

    useEffect(() => {
        document.body.classList.add('audience');
        return () => {
            document.body.classList.remove('audience');
        }
    }, [])

    useEffect(() => {

        loadAssemblyWallpaper();

        LiveSocket.emit(PlaylistPlayerSocketEvent.requestCurrentState, { requestor: 'audience' });

        (() => {

            var elem = document.documentElement;
            var fullscreenButton = document.querySelector(".fullscreen-button");

            function openFullscreen() {
                if (elem.requestFullscreen) {
                    elem.requestFullscreen();
                }
                fullscreenButton?.setAttribute("style", "display: none");
            }

            if (fullscreenButton) {
                fullscreenButton.addEventListener("click", () =>
                    openFullscreen(),
                );
            }

            // the fullscreen button only shows for 3 seconds when the page loads
            var buttonHideSeconds = 3;

            var buttonHideInterval = setInterval(() => {
                if (fullscreenButton) {
                    fullscreenButton.textContent =
                        "Click for fullscreen (" + buttonHideSeconds + ")";
                    buttonHideSeconds--;
                    if (buttonHideSeconds < 0) {
                        clearInterval(buttonHideInterval);
                        fullscreenButton.setAttribute("style", "display: none");
                    }
                }
            }, 1000);

        })();

        LiveSocket.on(PlaylistPlayerSocketEvent.setIsStarting, (args: Slide) => (setSlideContent(args.content), setSlideType('')));
        LiveSocket.on(PlaylistPlayerSocketEvent.setIsEnded, (args: Slide) => (setSlideContent(args.content), setSlideType('')));
        LiveSocket.on(PlaylistPlayerSocketEvent.setIsPaused, (args: Slide) => (setSlideContent(args.content), setSlideType('')));
        LiveSocket.on(PlaylistPlayerSocketEvent.setIsUnpaused, (args: Slide) => (setSlideContent(args.content), setSlideType('')));
        LiveSocket.on(PlaylistPlayerSocketEvent.setCurrentSlide, (args: Slide) => (setSlideContent(args.content), setSlideType(args.type)));

        LiveSocket.on('setScreenStyle', onSetScreenStyle);
        LiveSocket.on('exitPlaylist', onExitPlaylist);
        LiveSocket.on('setAssemblyWallpaper', onSetAssemblyWallpaper);

    }, []);

    const getSlideLineStyle = () => {

        let slideLineStyle = wallpaperFile?.slideLineStyle ?? new SlideLineStyle();

        return {
            margin: screenStyleComputed.audienceSlide.lineMargin,
            padding: screenStyleComputed.audienceSlide.linePadding,
            backgroundColor: '#' + slideLineStyle.backgroundColor,
            color: '#' + slideLineStyle.color
        }
    }

    const SlideContent = () => {
        let domParser = new DOMParser().parseFromString(slideContent, 'text/html');

        let lines = [...domParser.querySelectorAll('p')] as [];

        return <>
            {lines.map((line: HTMLParagraphElement, lineIndex: number) => <p key={lineIndex} style={getSlideLineStyle()} dangerouslySetInnerHTML={{ __html: line.innerHTML }} />)}
        </>
    }

    return <PlainLayout>

        {wallpaper.files.map((_wallpaperFile: WallpaperFile) => <div key={_wallpaperFile.filename}
            className={`wallpaper ${wallpaper.style.backgroundSize} animate__${wallpaper.style.slideshowAnimationSpeed} ${(_wallpaperFile.filename === wallpaperFile?.filename ? 'animate__animated animate__' + wallpaper.style.slideshowAnimationIn : 'animate__animated animate__' + wallpaper.style.slideshowAnimationOut)}`}
            style={{
                backgroundImage: (['jpg', 'png', 'gif', 'webp'].indexOf(getMimeTypeFormat(_wallpaperFile.mimetype as MimeType) ?? '') > -1
                    ? `url("${apiUrl}/wallpapers/file/${wallpaper.id}/${_wallpaperFile.filename}")`
                    : '')
            }}>

            {/* image background */}
            {['jpg', 'png', 'gif', 'webp'].indexOf(getMimeTypeFormat(_wallpaperFile.mimetype as MimeType) ?? '') > -1 && <img src={`${apiUrl}/wallpapers/file/${wallpaper.id}/${_wallpaperFile.filename}`} />}

            {/* video background */}
            {['mkv', 'mp4', 'webm', 'ogg', 'ogx'].indexOf(getMimeTypeFormat(_wallpaperFile.mimetype as MimeType) ?? '') > -1 && <video width="320" height="240" autoPlay muted loop>
                <source src={`${apiUrl}/wallpapers/file/${wallpaper.id}/${_wallpaperFile.filename}`} type="video/mp4"></source>
                <source src={`${apiUrl}/wallpapers/file/${wallpaper.id}/${_wallpaperFile.filename}`} type="video/ogg"></source>
                Your browser does not support the video tag.
            </video>}
        </div>)}

        <div className="fullscreen-button"> Click for Fullscreen mode</div>

        <div className="audience-slide" id="audience-slide-container"
            style={screenStyleComputed.audienceSlide}>
            {!isEmpty(slideType) && <div className={`audience-slide-type ${slideType} text-left `}
                style={{ ...screenStyleComputed.slideType, ...getSlideLineStyle() }}>{SlideTypeLabels[slideType]}</div>}
            <div className="audience-slide-content"><SlideContent /></div>
        </div>
    </PlainLayout >

}

export default Audience; 
