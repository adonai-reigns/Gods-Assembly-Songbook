import { useState, useEffect } from 'react';
import { getApiUrl, getLiveSocket } from '../../stores/server';
import { isEqual } from 'lodash';
import axios from 'axios';

import { Panel } from 'primereact/panel';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

import { LineMargin, LinePadding, Screen, ScreenStyle, Size, TextAlign } from '../../models/screen';
import AdminLayout from '../../layouts/AdminLayout';
import { InputText } from 'primereact/inputtext';

export interface propsInterface {
    className?: string,
    "client:only"?: boolean,
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
    },
    paddings: {
        extraSmall: 'None',
        small: 'Small',
        normal: 'Normal',
        big: 'Big',
        huge: 'Huge',
        jumbo: 'Jumbo'
    },
    margins: {
        extraSmall: 'None',
        small: 'Small',
        normal: 'Normal',
        big: 'Big',
        huge: 'Huge',
        jumbo: 'Jumbo'
    },
}

const AudienceScreenConfig = function (props: propsInterface) {

    props = { ...propsDefaults, ...props };

    const LiveSocket = getLiveSocket();

    const [screenId] = useState<number>(1);
    const [patchStatus, setPatchStatus] = useState<ScreenStyle | undefined>();

    const apiUrl = getApiUrl();

    const [applicationUrl, setApplicationUrl] = useState<string>('');

    const [screen, setScreen] = useState<Screen>(new Screen);
    const [screenName, setScreenName] = useState<string>('');
    const [screenStyle, setScreenStyle] = useState<ScreenStyle>(new ScreenStyle({}));

    const handleOnValueChange = function (name: string, value: string | boolean) {
        setScreenStyle((_screenStyle) => {
            let newStyleProp = { ..._screenStyle };
            Object.defineProperty(newStyleProp, name, { value });
            return new ScreenStyle(newStyleProp);
        });
    }

    const [sizesAsDropdownOptions, setSizesAsDropdownOptions] = useState<any[]>([]);
    const [linePaddingsAsDropdownOptions, setLinePaddingsAsDropdownOptions] = useState<any[]>([]);
    const [lineMarginsAsDropdownOptions, setLineMarginsAsDropdownOptions] = useState<any[]>([]);

    const [textAlignsAsDropdownOptions, setTextAlignsAsDropdownOptions] = useState<any[]>([]);
    const [booleanAsDropdownOptions, setBooleanAsDropdownOptions] = useState<booleanOptionsInterface[]>([]);

    const publishToScreen = function () {
        LiveSocket.emit('setScreenStyle', { screen });
    }

    useEffect(() => {
        axios.get(apiUrl + '/constants').then((response: any) => {
            if (response.data) {
                setApplicationUrl('http://' + response.data.ip);
            }
        }).catch(() => {
            axios.post(apiUrl + '/screens', {
                name: 'Audience',
                style: screenStyle
            }).then((response) => {
                setScreen(response.data);
                setScreenName(response.data.name);
                setScreenStyle(new ScreenStyle(response.data.style));
            }).catch(() => { })
        });
        setSizesAsDropdownOptions((): stringOptionsInterface[] => {
            let _sizesAsDropdownOptions: stringOptionsInterface[] = [];
            Object.values(Size).forEach((sizeValue: string) => {
                _sizesAsDropdownOptions.push({
                    label: lang.sizes[(sizeValue as keyof typeof lang.sizes)],
                    value: sizeValue
                });
            })
            return _sizesAsDropdownOptions;
        });
        setLinePaddingsAsDropdownOptions((): stringOptionsInterface[] => {
            let _paddingsAsDropdownOptions: stringOptionsInterface[] = [];
            Object.values(LinePadding).forEach((sizeValue: string) => {
                _paddingsAsDropdownOptions.push({
                    label: lang.paddings[(sizeValue as keyof typeof lang.paddings)],
                    value: sizeValue
                });
            })
            return _paddingsAsDropdownOptions;
        });
        setLineMarginsAsDropdownOptions((): stringOptionsInterface[] => {
            let _marginsAsDropdownOptions: stringOptionsInterface[] = [];
            Object.values(LineMargin).forEach((sizeValue: string) => {
                _marginsAsDropdownOptions.push({
                    label: lang.margins[(sizeValue as keyof typeof lang.margins)],
                    value: sizeValue
                });
            })
            return _marginsAsDropdownOptions;
        });
        setTextAlignsAsDropdownOptions((): stringOptionsInterface[] => {
            let _textAlignsAsDropdownOptions: stringOptionsInterface[] = [];
            Object.values(TextAlign).forEach((textAlignValue: string) => {
                _textAlignsAsDropdownOptions.push({
                    label: lang.textAligns[(textAlignValue as keyof typeof lang.textAligns)],
                    value: textAlignValue
                });
            })
            return _textAlignsAsDropdownOptions;
        });
        setBooleanAsDropdownOptions((): booleanOptionsInterface[] => {
            return [
                { label: 'True', value: true },
                { label: 'False', value: false }
            ];
        });

    }, []);

    useEffect(() => {
        axios.get(apiUrl + '/screens/' + screenId).then((response: any) => {
            if (response.data) {
                setScreen(response.data);
                setScreenName(response.data.name)
                setScreenStyle(new ScreenStyle(response.data.style));
            }
        }).catch(() => {
            axios.post(apiUrl + '/screens', {
                name: 'Audience',
                style: screenStyle
            }).then((response) => {
                setScreen(response.data);
                setScreenName(response.data.name);
                setScreenStyle(new ScreenStyle(response.data.style));
            }).catch(() => { })
        });
    }, [screenId]);

    useEffect(() => {
        if (patchStatus) {
            if (!isEqual(patchStatus, screenStyle)) {
                axios.patch(apiUrl + '/screens/' + screenId, {
                    name: screenName,
                    style: JSON.parse(JSON.stringify(screenStyle))
                }).then((response) => {
                    setScreen(response.data);
                    setPatchStatus(new ScreenStyle(response.data.style));
                }).catch(e => console.error(e));
            }
        } else {
            setPatchStatus(screenStyle);
            return;
        }

    }, [screenStyle]);

    return <AdminLayout>

        <Panel>

            <div className="field p-inputgroup flex-1">
                <span className="p-inputgroup-addon"><label htmlFor="application-url">Application URL</label></span>
                <InputText id="application-url" className="p-inputtext" value={applicationUrl} />
                <span className="p-inputgroup-addon" title="This is the address of God's Assembly Songbook on your network"><i className="pi pi-info"></i></span>
            </div>

            <div className="field p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <label htmlFor="font-size">Font Size</label>
                </span>
                <Dropdown id="font-size" placeholder="Font Size"
                    options={sizesAsDropdownOptions}
                    optionLabel="label"
                    optionValue="value"
                    value={screenStyle.fontSize}
                    onChange={e => handleOnValueChange('fontSize', e.target.value)} />
            </div>

            <div className="field p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <label htmlFor="font-size">Line Padding</label>
                </span>
                <Dropdown id="line-padding" placeholder="Line Padding"
                    options={linePaddingsAsDropdownOptions}
                    optionLabel="label"
                    optionValue="value"
                    value={screenStyle.linePadding}
                    onChange={e => handleOnValueChange('linePadding', e.target.value)} />
            </div>

            <div className="field p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <label htmlFor="font-size">Line Spacing</label>
                </span>
                <Dropdown id="line-margin" placeholder="Line Spacing"
                    options={lineMarginsAsDropdownOptions}
                    optionLabel="label"
                    optionValue="value"
                    value={screenStyle.lineMargin}
                    onChange={e => handleOnValueChange('lineMargin', e.target.value)} />
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
                    optionLabel="label"
                    optionValue="value"
                    onChange={e => handleOnValueChange('showSlideType', e.value)} />
            </div>
            <div className="field m-3 p-inputgroup flex justify-content-center">
                <Button onClick={publishToScreen}>Publish to Screen</Button>
            </div>

        </Panel>

    </AdminLayout>

}

export default AudienceScreenConfig;
