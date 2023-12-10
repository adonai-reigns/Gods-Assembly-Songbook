import { useState, useEffect } from 'react';
import axios from 'axios';

import LiveSocket from '../../components/live/LiveSocket';

import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

import { Screen, ScreenStyle, Size, TextAlign } from '../../models/screen';

export interface propsInterface {
    className?: string,
    "client:only"?: boolean,
}

export const propsDefaults = {
    className: '',
}

const lang = {
    sizes: {
        extraSmall: 'Extra Small',
        small: 'Small',
        normal: 'Normal',
        big: 'Big',
        huge: 'Huge',
        jumbo: 'Jumbo'
    },
    textAligns: {
        left: 'Left',
        center: 'Center',
        right: 'Right',
        justify: 'Justify'
    }
}

const AudienceScreenConfig = function (props: propsInterface) {

    props = { ...propsDefaults, ...props };

    const [screenId, setScreenId] = useState<number>(1);

    const url = new URL(window.location.href);
    const apiUrl = url.protocol + '//' + url.hostname + ':3000/api';

    const [screen, setScreen] = useState<Screen>(new Screen);
    const [screenName, setScreenName] = useState<string>('');
    const [screenStyle, setScreenStyle] = useState<ScreenStyle>(new ScreenStyle());

    const handleOnValueChange = function (name: string, value: string) {
        setScreenStyle((_screenStyle) => {
            let newStyleProp = {};
            eval('newStyleProp.' + name + ' = value;');
            return { ..._screenStyle, ...newStyleProp };
        });
    }

    const [sizesAsDropdownOptions, setSizesAsDropdownOptions] = useState<any[]>([]);
    const [textAlignsAsDropdownOptions, setTextAlignsAsDropdownOptions] = useState<any[]>([]);
    const [booleanAsDropdownOptions, setBooleanAsDropdownOptions] = useState<any[]>([]);

    const publishToScreen = function () {
        LiveSocket.emit('changeScreenStyle', { screen });
    }

    useEffect(() => {
        setSizesAsDropdownOptions((_sizesAsDropdownOptions) => {
            Object.values(Size).forEach((sizeValue: string) => {
                _sizesAsDropdownOptions.push({
                    label: lang.sizes[(sizeValue as keyof typeof lang.sizes)],
                    value: sizeValue
                });
            })
            return _sizesAsDropdownOptions;
        });
        setTextAlignsAsDropdownOptions((_textAlignsAsDropdownOptions) => {
            Object.values(TextAlign).forEach((textAlignValue: string) => {
                _textAlignsAsDropdownOptions.push({
                    label: lang.textAligns[(textAlignValue as keyof typeof lang.textAligns)],
                    value: textAlignValue
                });
            })
            return _textAlignsAsDropdownOptions;
        });
        setBooleanAsDropdownOptions((_booleanAsDropdownOptions) => {
            let booleanOptions: { [key: string]: boolean } = { true: true, false: false };
            Object.keys(booleanOptions).forEach((key: string) => {
                _booleanAsDropdownOptions.push({
                    label: key,
                    value: booleanOptions[key]
                });
            })
            return _booleanAsDropdownOptions;
        });

    }, []);

    useEffect(() => {
        axios.get(apiUrl + '/screens/' + screenId).then((response: any) => {
            if (response.data) {
                setScreen(response.data);
                setScreenName(response.data.name)
                setScreenStyle(response.data.style);
            }
        }).catch(() => {
            axios.post(apiUrl + '/screens', {
                name: 'Audience',
                style: screenStyle
            }).then((response) => {
                setScreen(response.data);
                setScreenName(response.data.name);
                setScreenStyle(response.data.style);
            }).catch(() => { })
        });
    }, [screenId]);

    useEffect(() => {
        axios.patch(apiUrl + '/screens/' + screenId, {
            name: screenName,
            style: screenStyle
        }).then((response) => {
            setScreen(response.data);
            setScreenName(response.data.name);
        });
    }, [screenStyle]);

    return <>

        <div className="field p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
                <label htmlFor="font-size">Font Size</label>
            </span>
            <Dropdown id="font-size" placeholder="Font Size"
                options={sizesAsDropdownOptions}
                value={screenStyle.fontSize}
                onChange={e => handleOnValueChange('fontSize', e.target.value)} />
        </div>

        <div className="field p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
                <label htmlFor="padding">Padding</label>
            </span>
            <Dropdown id="padding" placeholder="Padding"
                options={sizesAsDropdownOptions}
                value={screenStyle.padding}
                onChange={e => handleOnValueChange('padding', e.target.value)} />
        </div>

        <div className="field p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
                <label htmlFor="text-align">Text Align</label>
            </span>
            <Dropdown id="text-align" placeholder="Text Align"
                options={textAlignsAsDropdownOptions}
                value={screenStyle.textAlign}
                onChange={e => handleOnValueChange('textAlign', e.target.value)} />
        </div>

        <div className="field p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
                <label htmlFor="text-align">Show Slide Type</label>
            </span>
            <Dropdown id="text-align" placeholder="Show Slide Type"
                options={booleanAsDropdownOptions}
                value={screenStyle.showSlideType}
                onChange={e => handleOnValueChange('showSlideType', e.target.value)} />
        </div>
        <div className="field m-3 p-inputgroup flex justify-content-center">
            <Button onClick={publishToScreen}>Publish to Screen</Button>
        </div>

    </>

}

export default AudienceScreenConfig;
