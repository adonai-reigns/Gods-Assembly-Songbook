import { useState, useEffect } from 'react';
import { getApiUrl, getLiveSocket } from '../../stores/server';
import { isEqual, isNumber } from 'lodash';
import axios from 'axios';

import { Panel } from 'primereact/panel';
import { Slider } from 'primereact/slider';
import { Dropdown } from 'primereact/dropdown';
import { FormGroup } from '../../components/FormGroup';
import { FormSubmit } from '../../components/FormSubmit';

import { WallpaperPicker } from '../../components/WallpaperPicker';

import { config } from '../../stores/settings';

import {
    BackgroundSize,
    Wallpaper,
    WallpaperStyle,
    slideshowAnimationIns,
    slideshowAnimationOuts,
    slideshowAnimationSpeeds
} from '../../models/wallpaper';

import AdminLayout from '../../layouts/AdminLayout';

interface propsInterface {
    className?: string,
}

const propsDefaults = {
    className: '',
}

interface stringOptionsInterface {
    label: string,
    value: string
}

const lang = {
    backgroundSizes: {
        center: 'Center',
        stretch: 'Stretch',
        cover: 'Cover',
        contain: 'Contain',
        tile: 'Tile',
    },
    roles: {
        assembly: 'Assembly',
        playlist: 'Playlist',
        song: 'Song',
        slide: 'Slide'
    }
}

const Settings = function (props: propsInterface) {

    props = { ...propsDefaults, ...props };

    const LiveSocket = getLiveSocket();

    const apiUrl = getApiUrl();

    const [screenId] = useState<number>(1);
    const [wallpaperId] = useState<number>(1);
    const [wallpaper, setWallpaper] = useState<Wallpaper>(new Wallpaper());
    const [wallpaperStyle, setWallpaperStyle] = useState<WallpaperStyle>(new WallpaperStyle());
    const [slideshowAnimationInOptions] = useState<any>(slideshowAnimationIns);
    const [slideshowAnimationOutOptions] = useState<any>(slideshowAnimationOuts);
    const [slideshowAnimationSpeedOptions] = useState<any>(slideshowAnimationSpeeds);
    const [slideshowSpeed, setSlideshowSpeed] = useState<number>(wallpaperStyle.slideshowSpeed ?? 0);

    const [patchStatus, setPatchStatus] = useState<WallpaperStyle | undefined>();

    const [backgroundSizesAsDropdownOptions, setBackgroundSizesAsDropdownOptions] = useState<any[]>([]);

    const publishToScreen = function () {
        LiveSocket.emit('setAssemblyWallpaper', { wallpaper: { ...wallpaper, style: wallpaperStyle } });
    }

    const onAdd = () => {
        reloadWallpaper();
    }

    const onDelete = () => {
        reloadWallpaper();
    }

    const onChange = () => {
        reloadWallpaper();
    }

    const reloadWallpaper = () => {
        axios.get(apiUrl + '/wallpapers/' + wallpaperId).then((response: any) => {
            if (response.data) {
                setWallpaper(response.data);
            }
        }).catch(() => { });
    }

    useEffect(() => {
        setBackgroundSizesAsDropdownOptions((): stringOptionsInterface[] => {
            let _sizesAsDropdownOptions: stringOptionsInterface[] = [];
            Object.values(BackgroundSize).forEach((sizeValue: string) => {
                _sizesAsDropdownOptions.push({
                    label: lang.backgroundSizes[(sizeValue as keyof typeof lang.backgroundSizes)],
                    value: sizeValue
                });
            })
            return _sizesAsDropdownOptions;
        });

        reloadWallpaper();

    }, []);

    useEffect(() => {
        setWallpaperStyle(wallpaper.style);
        setSlideshowSpeed(wallpaperStyle.slideshowSpeed);
    }, [wallpaper]);

    useEffect(() => {
        if (wallpaperId > 0 && patchStatus) {
            if (!isEqual(patchStatus, wallpaperStyle)) {
                axios.patch(apiUrl + '/wallpapers/' + wallpaperId, {
                    style: wallpaperStyle
                }).then((response) => {
                    setWallpaperStyle(response.data.style);
                    setPatchStatus(response.data.style);
                });
            }
        } else {
            setPatchStatus(wallpaperStyle);
            return;
        }

    }, [wallpaperStyle]);

    return <AdminLayout>

        <Panel>

            <FormGroup label="Background Size" infoContent="How do you want the background images will be resized to fit the Audience' screen?">
                <Dropdown id="background-size" placeholder="Background Size"
                    options={backgroundSizesAsDropdownOptions}
                    value={wallpaperStyle.backgroundSize}
                    onChange={e => setWallpaperStyle({ ...wallpaperStyle, backgroundSize: e.target.value })} />
            </FormGroup>

            <FormGroup label="Slideshow Speed (seconds)" infoContent="How many seconds to wait between loading each background image?">
                <div className="w-full flex flex-column justify-content-center p-inputtext border-noround">
                    <Slider className="" id="longpress-timeout" placeholder="Slideshow Speed (seconds)"
                        value={slideshowSpeed}
                        min={config.wallpaper.slideshowSpeed.min}
                        max={config.wallpaper.slideshowSpeed.max}
                        step={config.wallpaper.slideshowSpeed.step}
                        onSlideEnd={e => setWallpaperStyle({ ...wallpaperStyle, slideshowSpeed: isNumber(e.value) ? e.value : e.value[0] })}
                        onChange={e => setSlideshowSpeed(isNumber(e.value) ? e.value : e.value[0])} />
                </div>
                <div className="p-inputgroup-addon">{slideshowSpeed}s</div>
            </FormGroup>

            <FormGroup label="Slideshow Animation In" infoContent="How do you want the background images to start?">
                <Dropdown id="background-size" placeholder="Slideshow Animation In"
                    options={slideshowAnimationInOptions}
                    optionLabel="title"
                    optionValue="code"
                    value={wallpaperStyle.slideshowAnimationIn ?? 'fadeIn'}
                    onChange={e => setWallpaperStyle({ ...wallpaperStyle, slideshowAnimationIn: e.target.value })} />
            </FormGroup>

            <FormGroup label="Slideshow Animation Out" infoContent="How do you want the background images to end?">
                <Dropdown id="background-size" placeholder="Slideshow Animation Out"
                    options={slideshowAnimationOutOptions}
                    optionLabel="title"
                    optionValue="code"
                    value={wallpaperStyle.slideshowAnimationOut ?? 'fadeOut'}
                    onChange={e => setWallpaperStyle({ ...wallpaperStyle, slideshowAnimationOut: e.target.value })} />
            </FormGroup>

            <FormGroup label="Slideshow Animation Speed" infoContent="How fast would you like the transition when the background images change?">
                <Dropdown id="background-size" placeholder="Slideshow Animation Speed"
                    options={slideshowAnimationSpeedOptions}
                    optionLabel="title"
                    optionValue="code"
                    value={wallpaperStyle.slideshowAnimationSpeed ?? 'normal'}
                    onChange={e => setWallpaperStyle({ ...wallpaperStyle, slideshowAnimationSpeed: e.target.value })} />
            </FormGroup>

            <WallpaperPicker className="m-3" wallpaperId={wallpaperId} screenId={screenId} multiple={true} onAdd={onAdd} onDelete={onDelete} onChange={onChange} />

            <FormSubmit onClick={publishToScreen}>Publish</FormSubmit>

        </Panel>

    </AdminLayout>

}

export default Settings;
''