import { ipcRenderer, remote, shell } from 'electron';
const { app, dialog, getCurrentWindow } = remote;

require('electron').webFrame.setZoomLevelLimits(1, 1);

// NOTE: paths relative to the dist directory
import { handleTrafficLightsClicks, $ } from '../js/utils';
import keybind from '../js/keybind';

const electronWindow = getCurrentWindow();

// called when document is ready to go
document.addEventListener('DOMContentLoaded', () => {
    // setup the traffic lights
    handleTrafficLightsClicks();

    // element definitions
    const screenshotLocation = $('.screenshot-location');
    const chooseLocationButton = $('.choose-location-btn');
    const regionButton = $('.region-btn');
    const shortcut = $('.keybind');
    const body = document.body;

    // clicking the choose button
    chooseLocationButton.addEventListener('click', () => {
        const directories = dialog.showOpenDialog(electronWindow, { properties: ['openDirectory'] });
        if (directories) {
            app.settings.set('outDir', directories[0]);
            setScreenshotLocation(directories[0]);
        }
    });

    // used to set the screenshot location
    function setScreenshotLocation(value) {
        screenshotLocation.dataset.outDir = value;
        screenshotLocation.innerHTML = `.../${value.split('/').pop()}`;
        screenshotLocation.setAttribute('title', value);
    }

    // set the screenshot location text to the one saved
    setScreenshotLocation(app.settings.get('outDir'));

    // pull in the default keybind
    shortcut.dataset.accelerator = app.settings.get('shortcut');

    // bind the keybind input
    keybind(shortcut, () => {
        const accelerator = shortcut.dataset.accelerator;
        // update the settings
        app.settings.set('shortcut', accelerator);
        // update the shortcut
        ipcRenderer.send('update-shortcut', accelerator);
        // re-enable all shortcuts
        ipcRenderer.send('enable-shortcuts');
    });

    // click on the region buton
    regionButton.addEventListener('click', () => {
        ipcRenderer.send('open-region');
    });
});
