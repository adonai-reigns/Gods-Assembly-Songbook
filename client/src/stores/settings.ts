import { atom } from 'nanostores';
import { getApiUrl } from './server';
import axios from 'axios';

import { Setting } from '../models/settings';

const apiUrl = getApiUrl();

export const settingsStore = atom<Setting[]>([]);

export const getSettingValue = (name: string): any | undefined => {
    let setting = settingsStore.get().filter((setting: Setting) => setting.name === name);
    if (setting && setting[0]) {
        return setting[0].value;
    }
}

export const getSetting = (name: string): Setting | undefined => {
    let setting = settingsStore.get().filter((setting: Setting) => setting.name === name);
    if (setting && setting[0]) {
        return setting[0];
    }
}

export const loadSettings = () => {
    axios.get(apiUrl + '/settings/').then((response) => {
        settingsStore.set([...response.data.map((setting: Setting): Setting => setting)]);
    });
}

export const config = {
    clicker: {
        longpressTimeout: {
            min: 200,
            max: 2000,
            step: 100
        },
        ignoreTypingDelay: {
            min: 0,
            max: 600,
            step: 10
        }
    },
    wallpaper: {
        slideshowSpeed: {
            min: 0,
            max: 600,
            step: 1
        }
    }
}



