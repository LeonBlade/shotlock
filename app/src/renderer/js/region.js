import { ipcRenderer, remote } from 'electron';
const { app, getCurrentWindow } = remote;

const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;
const KEY_ENTER = 13;
const KEY_ESCAPE = 27;

const electronWindow = getCurrentWindow();

// once the page loads
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('keydown', e => {
        let { x, y, width, height } = electronWindow.getBounds();
        switch (e.keyCode) {
            case KEY_LEFT:
                if (e.shiftKey) width--;
                else x--;
                break;
            case KEY_RIGHT:
                if (e.shiftKey) width++;
                else x++;
                break;
            case KEY_UP:
                if (e.shiftKey) height--;
                else y--;
                break;
            case KEY_DOWN:
                if (e.shiftKey) height++;
                else y++;
                break;
            case KEY_ENTER:
            case KEY_ESCAPE:
                electronWindow.close();
                break;
        }
        electronWindow.setBounds({ x, y, width, height });
    });
});
