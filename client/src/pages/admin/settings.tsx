import { useState, useEffect } from 'react';
import { getApiUrl, getLiveSocket } from '../../stores/server';
import axios from 'axios';

import { Panel } from 'primereact/panel';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

import WallpaperPicker from '../../components/WallpaperPicker';

import { BackgroundSize, Wallpaper, WallpaperStyle } from '../../models/wallpaper';

import AdminLayout from '../../layouts/AdminLayout';

export interface propsInterface {
    className?: string,
}

export const propsDefaults = {
    className: '',
}

export interface booleanOptionsInterface {
    label: string,
    value: boolean
}

export interface stringOptionsInterface {
    label: string,
    value: string
}

export interface numberOptionsInterface {
    label: string,
    value: number
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

    const [wallpaperId] = useState<number>(1);
    const [wallpaper, setWallpaper] = useState<Wallpaper>(new Wallpaper());
    const [wallpaperStyle, setWallpaperStyle] = useState<WallpaperStyle>(new WallpaperStyle());

    const [patchStatus, setPatchStatus] = useState<WallpaperStyle | undefined>();

    const [backgroundSizesAsDropdownOptions, setBackgroundSizesAsDropdownOptions] = useState<any[]>([]);

    const publishToScreen = function () {
        LiveSocket.emit('changeAssemblyWallpaper', { wallpaper: { ...wallpaper, style: wallpaperStyle } });
    }

    const onAdd = () => {
        reloadWallpaper();
    }

    const onDelete = () => {
        reloadWallpaper();
    }

    const onSort = () => {
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
    }, [wallpaper]);

    useEffect(() => {
        if (wallpaperId > 0 && patchStatus) {
            if (JSON.stringify(Object.fromEntries(Object.entries(patchStatus).sort())) !== JSON.stringify(Object.fromEntries(Object.entries(wallpaperStyle).sort()))) {
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

            <div className="field p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <label htmlFor="background-size">Background Position</label>
                </span>
                <Dropdown id="background-size" placeholder="Background Size"
                    options={backgroundSizesAsDropdownOptions}
                    value={wallpaperStyle.backgroundSize}
                    onChange={e => setWallpaperStyle({ ...wallpaperStyle, backgroundSize: e.target.value })} />
            </div>

            <div className="field p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <label htmlFor="slideshow-speed">Slideshow Speed (seconds)</label>
                </span>
                <InputNumber id="slideshow-speed" placeholder="Slideshow Speed"
                    value={wallpaperStyle.slideshowSpeed}
                    onChange={e => setWallpaperStyle({ ...wallpaperStyle, slideshowSpeed: e.value ?? 0 })} />
            </div>

            <WallpaperPicker className="m-3" wallpaperId={wallpaperId} multiple={true} onAdd={onAdd} onDelete={onDelete} onSort={onSort} />

            <div className="field m-3 p-inputgroup flex justify-content-center">
                <Button onClick={publishToScreen}>Publish</Button>
            </div>

        </Panel>

    </AdminLayout>

}

export default Settings;
