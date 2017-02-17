import path from 'path';
import execa from 'execa';
import { app, BrowserWindow, ipcMain, globalShortcut } from 'electron';
import electronLocalShortcut from 'electron-localshortcut';
import * as settings from '../common/settings-manager';

let mainWindow;

function createWindow() {
    // get x and y from settings
    const { x, y } = settings.get('mainWindow');

    // create the main window
    mainWindow = new BrowserWindow({
        x,
        y,
        width: 320,
        height: 200,
        title: 'ShotLock',
        frame: false,
        resizable: false,
        show: false,
        backgroundColor: '#000'
    });

    // load the URL for the main window
    mainWindow.loadURL(`file://${__dirname}/../renderer/views/main.html`);

    // display when ready to show
    mainWindow.once('ready-to-show', mainWindow.show);

    // when the window gets closed
    mainWindow.on('close', () => {
        // get bounds from main window
        const bounds = mainWindow.getBounds();
        // set x and y in volatile settings
        settings.set('mainWindow.x', bounds.x, true);
        settings.set('mainWindow.y', bounds.y, true);
    });

    // set the window to null
    mainWindow.on('closed', () => { mainWindow = null; });
}

// when the application is ready create window
app.on('ready', () => {
    // create main widnow
    createWindow();

    // add the settings into the app object
    app.settings = settings;

    console.log('cmd+shift+4',electronLocalShortcut.isRegistered('Command+Shift+4'));
    console.log('cmd+-',electronLocalShortcut.isRegistered('Command+-'));
    console.log('cmd+shift+t',electronLocalShortcut.isRegistered('Command+Shift+T'));

    console.log('cmd+shift+4',globalShortcut.isRegistered('Command+Shift+4'));
    console.log('cmd+-',globalShortcut.isRegistered('Command+-'));
    console.log('cmd+shift+t',globalShortcut.isRegistered('Command+Shift+T'));

    // main screenshot function
    const ret = globalShortcut.register(settings.get('shortcut'), () => {
        const { x, y, width, height } = mainWindow.getBounds();
        mainWindow.hide();
        execa('screencapture', [ '-t', 'jpg', `-R${x},${y},${width},${height}`, '/Users/LeonBlade/Desktop/test.jpg' ]).then(() => {
            mainWindow.show();
        });
    })
});

// when all windows close
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        app.quit();
});

// emulate macOS functionality
app.on('activate', () => {
    if (mainWindow === null)
        createWindow();
});

// when the application will close
app.on('will-quit', () => {
    // unregister all shortcuts
    globalShortcut.unregisterAll();
});

// ipc main stuff
ipcMain.on('close-window', event => {
    BrowserWindow.fromWebContents(event.sender).close();
});
