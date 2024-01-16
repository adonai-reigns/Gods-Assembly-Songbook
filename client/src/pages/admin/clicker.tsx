import { useState, useEffect } from 'react';
import { getApiUrl } from '../../stores/server';
import axios from 'axios';

import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Slider } from 'primereact/slider';
import { Chips } from 'primereact/chips';

import { Setting } from '../../models/settings';

import AdminLayout from '../../layouts/AdminLayout';
import { config } from '../../stores/settings';

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

const Clicker = function (props: propsInterface) {

    props = { ...propsDefaults, ...props };

    const apiUrl = getApiUrl();

    const [longpressTimeout, setLongpressTimeout] = useState(0);
    const [ignoreTypingDelay, setIgnoreTypingDelay] = useState(0);
    const [clickerLeftButtonCharCode, setClickerLeftButtonCharCode] = useState('');
    const [clickerRightButtonCharCode, setClickerRightButtonCharCode] = useState('');
    const [clickerUpButtonCharCode, setClickerUpButtonCharCode] = useState('');
    const [clickerDownButtonCharCode, setClickerDownButtonCharCode] = useState('');
    const [clickerSuppressKeyDefaults, setClickerSuppressKeyDefaults] = useState<string[]>([]);

    const [settings, setSettings] = useState<Setting[]>([]);

    const reloadSettings = () => {
        axios.get(apiUrl + '/settings').then((response: any) => {
            if (response.data) {
                setSettings(response.data);
            }
        }).catch(() => { });
    }

    const updateSettingsValue = (settingName: string, newValue: any) => {
        if (settings.filter((setting: Setting) => setting.name === settingName).length > 0 && settings.filter((setting: Setting) => setting.name === settingName)[0].value !== newValue) {
            axios.patch(apiUrl + '/settings', {
                name: settingName,
                value: newValue
            }).then(() => { }).catch(() => { });
        }
    }

    useEffect(() => {
        reloadSettings();
    }, []);

    useEffect(() => {
        updateSettingsValue('clickerLeftButtonCharCode', clickerLeftButtonCharCode);
    }, [clickerLeftButtonCharCode]);

    useEffect(() => {
        updateSettingsValue('clickerRightButtonCharCode', clickerRightButtonCharCode);
    }, [clickerRightButtonCharCode]);

    useEffect(() => {
        updateSettingsValue('clickerUpButtonCharCode', clickerUpButtonCharCode);
    }, [clickerUpButtonCharCode]);

    useEffect(() => {
        updateSettingsValue('clickerDownButtonCharCode', clickerDownButtonCharCode);
    }, [clickerDownButtonCharCode]);

    useEffect(() => {
        updateSettingsValue('clickerSuppressKeyDefaults', clickerSuppressKeyDefaults);
    }, [clickerSuppressKeyDefaults]);

    useEffect(() => {

        if (settings && settings.length) {

            settings.map((setting: Setting) => {

                switch (setting.name) {

                    case 'clickerLongpressTimeout':
                        if (longpressTimeout !== setting.value) {
                            setLongpressTimeout(setting.value);
                        }
                        break;

                    case 'clickerIgnoreTypingDelay':
                        if (ignoreTypingDelay !== setting.value) {
                            setIgnoreTypingDelay(setting.value);
                        }
                        break;

                    case 'clickerLeftButtonCharCode':
                        if (clickerLeftButtonCharCode !== setting.value) {
                            setClickerLeftButtonCharCode(setting.value);
                        }
                        break;

                    case 'clickerRightButtonCharCode':
                        if (clickerRightButtonCharCode !== setting.value) {
                            setClickerRightButtonCharCode(setting.value);
                        }
                        break;

                    case 'clickerUpButtonCharCode':
                        if (clickerUpButtonCharCode !== setting.value) {
                            setClickerUpButtonCharCode(setting.value);
                        }
                        break;

                    case 'clickerDownButtonCharCode':
                        if (clickerDownButtonCharCode !== setting.value) {
                            setClickerDownButtonCharCode(setting.value);
                        }
                        break;

                    case 'clickerSuppressKeyDefaults':
                        if (clickerSuppressKeyDefaults !== setting.value) {
                            setClickerSuppressKeyDefaults(setting.value);
                        }
                        break;

                }

            });

        }

    }, [settings]);

    return <AdminLayout>

        <Panel>

            <div className="field p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <label htmlFor="background-size">Button Longpress Timeout</label>
                </span>
                <div className="w-full flex flex-column justify-content-center p-inputtext border-noround">
                    <Slider className="" id="longpress-timeout" placeholder="Longpress Timeout"
                        value={longpressTimeout}
                        min={config.clicker.longpressTimeout.min}
                        max={config.clicker.longpressTimeout.max}
                        step={config.clicker.longpressTimeout.step}
                        onSlideEnd={e => updateSettingsValue('clickerLongpressTimeout', e.value)}
                        onChange={e => setLongpressTimeout((typeof e.value === 'object' ? e.value[0] : e.value))} />
                </div>
                <div className="p-inputgroup-addon">{longpressTimeout}ms</div>
            </div>

            <div className="field p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <label htmlFor="background-size">Ignore Typing Delay</label>
                </span>
                <div className="w-full flex flex-column justify-content-center p-inputtext border-noround">
                    <Slider className="" id="longpress-timeout" placeholder="Ignore Typing Delay"
                        value={ignoreTypingDelay}
                        min={config.clicker.ignoreTypingDelay.min}
                        max={config.clicker.ignoreTypingDelay.max}
                        step={config.clicker.ignoreTypingDelay.step}
                        onSlideEnd={e => updateSettingsValue('clickerIgnoreTypingDelay', e.value)}
                        onChange={e => setIgnoreTypingDelay((typeof e.value === 'object' ? e.value[0] : e.value))} />
                </div>
                <div className="p-inputgroup-addon">{ignoreTypingDelay}ms</div>
            </div>

            <div className="field p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <label htmlFor="background-size">Clicker Left Button Char Code</label>
                </span>
                <InputText name="clickerLeftButtonCharCode"
                    onKeyDown={(e) => e.preventDefault()}
                    onKeyUp={(e) => { e.stopPropagation(); e.preventDefault(); setClickerLeftButtonCharCode((e.ctrlKey ? 'CTRL+' : '') + e.code) }}
                    value={clickerLeftButtonCharCode} />
            </div>

            <div className="field p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <label htmlFor="background-size">Clicker Right Button Char Code</label>
                </span>
                <InputText name="clickerRightButtonCharCode"
                    onKeyDown={(e) => e.preventDefault()}
                    onKeyUp={(e) => { e.stopPropagation(); e.preventDefault(); setClickerRightButtonCharCode((e.ctrlKey ? 'CTRL+' : '') + e.code) }}
                    value={clickerRightButtonCharCode} />
            </div>

            <div className="field p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <label htmlFor="background-size">Clicker Up Button Char Code</label>
                </span>
                <InputText name="clickerUpButtonCharCode"
                    onKeyDown={(e) => e.preventDefault()}
                    onKeyUp={(e) => { e.stopPropagation(); e.preventDefault(); setClickerUpButtonCharCode((e.ctrlKey ? 'CTRL+' : '') + e.code) }}
                    value={clickerUpButtonCharCode} />
            </div>

            <div className="field p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <label htmlFor="background-size">Clicker Down Button Char Code</label>
                </span>
                <InputText name="clickerDownButtonCharCode"
                    onKeyDown={(e) => e.preventDefault()}
                    onKeyUp={(e) => { e.stopPropagation(); e.preventDefault(); setClickerDownButtonCharCode((e.ctrlKey ? 'CTRL+' : '') + e.code) }}
                    value={clickerDownButtonCharCode} />
            </div>

            <div className="field p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <label htmlFor="background-size">Clicker Ignore Key Defaults</label>
                </span>
                <Chips name="clickerSuppressKeyDefaults"
                    onChange={(e) => setClickerSuppressKeyDefaults(e.value ?? [])}
                    value={clickerSuppressKeyDefaults} />
            </div>

            <div className="field m-3 p-inputgroup flex justify-content-center">
                <Button onClick={() => { }}>Publish</Button>
            </div>

        </Panel>

    </AdminLayout>

}

export default Clicker;
