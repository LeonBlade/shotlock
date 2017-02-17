import { homedir } from 'os';

import { app } from 'electron';
import settings from 'electron-settings';
import objectPath from 'object-path';

const DEFAULTS = {
    outDir: `${homedir()}/Desktop`,
    shortcut: 'Command+Shift+5'
};

const volatiles = {
    region: {
        x: 'center',
        y: 'center',
        width: 500,
        height: 350
    },
    mainWindow: {
        x: 'center',
        y: 'center'
    }
};

// initialize settings wit defaults
settings.defaults(DEFAULTS);
settings.applyDefaultsSync();

function get(key) {
    return objectPath.get(volatiles, key) || settings.getSync(key);
}

function getAll() {
    return Object.assign({}, volatiles, settings.getSync());
}

function set(key, value, volatile = false) {
    if (volatile)
        return objectPath.set(volatiles, key, value);
    settings.setSync(key, value);
}

function observe(keyPath, handler) {
    return settings.observe(keyPath, handler);
}

export { get, getAll, set, observe };
