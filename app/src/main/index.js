import path from 'path';
import execa from 'execa';
import { app, BrowserWindow, ipcMain, globalShortcut } from 'electron';

let mainWindow;

function createWindow() {
    // create the main window
    mainWindow = new BrowserWindow({
        width: 320,
        height: 200,
        title: 'Shot Lock',
        frame: false,
        resizable: false,
        preloadWindow: true,
        hasShadow: true,
        background: '#222'
    });

    // load the URL for the main window
    mainWindow.loadURL(`file://${__dirname}/../renderer/views/main.html`);

    // when the window gets closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// when the application is ready create window
app.on('ready', () => {
    // create main window
    createWindow();

    // main screenshot function
    const ret = globalShortcut.register('Command+Shift+5', () => {
        const { x, y, width, height } = mainWindow.getBounds();
        mainWindow.hide();
        execa('screencapture', [ '-t', 'jpg', `-R${x},${y},${width},${height}`, '/Users/LeonBlade/Desktop/test.jpg' ]).then(() => {
            mainWindow.show();
        });
    })
});

// when all windows close
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// when activating the app
app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

// when the application will close
app.on('will-quit', () => {
    // unregister all shortcuts
    globalShortcut.unregisterAll();
});

// ipc main stuff
ipcMain.on('close-window', event => {
    const window = BrowserWindow.fromWebContents(event.sender);
    window.close();
});
