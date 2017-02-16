const { ipcRenderer } = require('electron');

// a jQuery-like query selector helper function
function $(selector, context = document) {
    return document.querySelector(selector);
}

// when clicking on the "traffic lights" at the top of the window
function handleTrafficLightsClicks (wrapper = $('.title-bar__controls')) {
    const closeButton = wrapper.querySelector('.close-window');

    closeButton.addEventListener('click', () => {
        ipcRenderer.send('close-window');
    });
}

export { handleTrafficLightsClicks, $ };
