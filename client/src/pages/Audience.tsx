import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

import LiveSocket from '../components/live/LiveSocket';

import Slide, { SlideTypeLabels } from '../models/slide';
import { ScreenStyle, ScreenStyleComputed } from '../models/screen';
import { Wallpaper, File } from '../models/wallpaper';

import PlainLayout from '../layouts/PlainLayout';
import "./Audience.scss";

export interface propsInterface {
    className?: string;
    children?: any;
}

export const propsDefaults = {
    className: '',
}

const TextSizesUnits = {
    extraSmall: '1em',
    small: '1.2em',
    normal: '1.8em',
    big: '2.4em',
    huge: '3.2em',
    jumbo: '3.8em'
}

const PaddingSizesUnits = {
    extraSmall: '0em',
    small: '0.8em',
    normal: '1.2em',
    big: '2.4em',
    huge: '3.2em',
    jumbo: '4.5em'
}

const Audience = function (props: propsInterface) {

    props = { ...propsDefaults, ...props };

    const url = new URL(window.location.href);
    const apiUrl = url.protocol + '//' + url.hostname + ':3000/api';

    const [screenId] = useState<number>(1);
    const [assemblyWallpaperId] = useState<number>(1);

    const defaultWallpaper = new Wallpaper();

    const [wallpaper, setWallpaper] = useState<Wallpaper>(defaultWallpaper);
    const [wallpaperFile, setWallpaperFile] = useState<File | undefined>(undefined);
    const wallpaperCycleInterval = useRef<any>(null);

    const [currentSlide, setCurrentSlide] = useState<Slide>(new Slide());
    const [slideContent, setSlideContent] = useState<string>('');
    const [slideType, setSlideType] = useState<string>('');
    const [screenStyleComputed, setScreenStyleComputed] = useState<ScreenStyleComputed>(new ScreenStyleComputed());

    const computeScreenStyle = (screenStyle: ScreenStyle): ScreenStyleComputed => {
        let newScreenStyleComputed = new ScreenStyleComputed();
        newScreenStyleComputed.audienceSlide.fontSize = TextSizesUnits[screenStyle.fontSize];
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

    function onChangeSlide(payload: any) {
        switch (payload.slide) {
            case 'pauseSlide':
            case 'startSlide':
            case 'endSlide':
                setSlideContent(payload.slideContent);
                setSlideType(payload.slideType);
                break;
            default:
                if (payload.slide !== undefined) {
                    setCurrentSlide(payload.slide);
                    setSlideContent(payload.slide.content);
                    setSlideType(SlideTypeLabels[payload.slide.type]);
                }
        }
    }

    function onChangeScreenStyle(payload: any) {
        if (payload.screen.id === screenId) {
            setScreenStyleComputed(computeScreenStyle(payload.screen.style));
        }
    }

    function onChangeAssemblyWallpaper(payload: any) {
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
        setWallpaperFile((_wallpaperFile): File | undefined => {
            if (wallpaper.files.length > 0) {
                let currentFileIndex = -1;
                if (_wallpaperFile !== undefined) {
                    currentFileIndex = wallpaper.files.map((file: File) => file.filename).indexOf(_wallpaperFile.filename);
                }
                let nextFileIndex = currentFileIndex + 1;
                if (nextFileIndex > wallpaper.files.length - 1) {
                    nextFileIndex = 0;
                }
                let nextWallpaperFile = { ...wallpaper.files[nextFileIndex] } as File;
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

        loadAssemblyWallpaper();

        LiveSocket.emit('requestCurrentSlide', { requestor: 'audience' });

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

        LiveSocket.on('changeSlide', onChangeSlide);
        LiveSocket.on('changeScreenStyle', onChangeScreenStyle);
        LiveSocket.on('exitPlaylist', onExitPlaylist);
        LiveSocket.on('changeAssemblyWallpaper', onChangeAssemblyWallpaper);

    }, [])

    return <PlainLayout>

        {wallpaperFile && <div className={`wallpaper ${wallpaper.style.backgroundSize}`} style={{ backgroundImage: `url("${apiUrl}/wallpapers/file/${wallpaper.id}/${wallpaperFile.filename}")` }}>
            <img src={`${apiUrl}/wallpapers/file/${wallpaper.id}/${wallpaperFile.filename}`} />
        </div>}

        <div className="fullscreen-button">Click for Fullscreen mode</div>

        <div className="audience-slide" id="audience-slide-container"
            style={screenStyleComputed.audienceSlide}>
            <div className={`audience-slide-type ${currentSlide.type} text-left `}
                style={screenStyleComputed.slideType}>{slideType}</div>
            <div className="audience-slide-content"
                dangerouslySetInnerHTML={{ __html: slideContent }} />
        </div>
    </PlainLayout>

}

export default Audience; 
