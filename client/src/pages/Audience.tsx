import { useEffect, useState } from 'react';
import axios from 'axios';
import LiveSocket from '../components/live/LiveSocket';

import Slide, { SlideTypeLabels } from '../models/slide';
import { Screen, ScreenStyle, ScreenStyleComputed } from '../models/screen';

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

    const [screenId, setScreenId] = useState<number>(1);

    const [currentSlide, setCurrentSlide] = useState<Slide>(new Slide());
    const [slideContent, setSlideContent] = useState<string>('');
    const [slideType, setSlideType] = useState<string>('');
    const [screen, setScreen] = useState<Screen>(new Screen());
    const [screenStyleComputed, setScreenStyleComputed] = useState<ScreenStyleComputed>(new ScreenStyleComputed());

    const computeScreenStyle = (screenStyle: ScreenStyle): ScreenStyleComputed => {
        let newScreenStyleComputed = new ScreenStyleComputed();
        newScreenStyleComputed.audienceSlide.fontSize = TextSizesUnits[screenStyle.fontSize];
        newScreenStyleComputed.audienceSlide.padding = PaddingSizesUnits[screenStyle.padding];
        newScreenStyleComputed.audienceSlide.textAlign = screenStyle.textAlign;
        newScreenStyleComputed.slideType.display = ((['true', true].indexOf(screenStyle.showSlideType) > -1) ? 'block' : 'none');
        return newScreenStyleComputed;
    }

    useEffect(() => {

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
                setScreen(payload.screen);
                setScreenStyleComputed(computeScreenStyle(payload.screen.style));
            }
        }

        function onExitPlaylist(){
            let container = document.getElementById('audience-slide-container');
            if(container){
                container.innerHTML = '';
            }
        }

        LiveSocket.on('changeSlide', onChangeSlide);
        LiveSocket.on('changeScreenStyle', onChangeScreenStyle);
        LiveSocket.on('exitPlaylist', onExitPlaylist);

        return () => {
            LiveSocket.off('changeSlide', onChangeSlide);
            LiveSocket.on('changeScreenStyle', onChangeScreenStyle);
            LiveSocket.on('exitPlaylist', onExitPlaylist);
        };

    });

    useEffect(() => {
        axios.get(apiUrl + '/screens/' + screenId).then((response: any) => {
            if (response.data) {
                setScreen(response.data);
                setScreenStyleComputed(computeScreenStyle(response.data.style));
            }
        }).catch(() => { });
    }, [screenId]);

    useEffect(() => {
        LiveSocket.emit('requestCurrentSlide', { requestor: 'audience' });
    }, [])

    return <>
        <div className="audience-slide" id="audience-slide-container"
            style={screenStyleComputed.audienceSlide}>
            <div className={`audience-slide-type ${currentSlide.type} text-left `}
                style={screenStyleComputed.slideType}>{slideType}:</div>
            <div className="audience-slide-content"
                dangerouslySetInnerHTML={{ __html: slideContent }} />
        </div>
    </>

}

export default Audience; 
