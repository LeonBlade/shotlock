import { ipcRenderer, remote, shell } from 'electron';

// NOTE: paths relative to the dist directory
import { handleTrafficLightsClicks } from '../js/utils';

// called when document is ready to go
document.addEventListener('DOMContentLoaded', () => {
    // setup the traffic lights
    handleTrafficLightsClicks();
});
