import path from 'path';
import * as helper from '../common/helper';
import moment from 'moment';
import { app, BrowserWindow, ipcMain, screen } from 'electron';
import * as settings from '../common/settings-manager';
import * as shortcut from '../common/shortcut-manager';

let mainWindow;

const shortcuts = [];

function createWindow() {
    // get x and y from settings
    const { x, y } = settings.get('mainWindow');

    // create the main window
    mainWindow = new BrowserWindow({
        x,
        y,
        width: 320,
        height: 250,
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

    // main screenshot function
    registerShortcut(settings.get('shortcut'));
});

// regsiter screenshot shortcut
function registerShortcut(accelerator) {
    shortcut.register('take-screenshot', accelerator, takeScreenshot);
}

function takeScreenshot() {
    // get properties from mainwindow bounds
    // TODO: do this for the region window
    let { x, y, width, height } = settings.get('region');
    const screenSize = screen.getPrimaryDisplay().workAreaSize;
    if (x == 'center')
        x = Math.round((screenSize.width / 2) - (width / 2));
    if (y == 'center')
        y = Math.round((screenSize.height / 2) - (height / 2));

    const ext = 'jpg';
    const output = path.resolve(settings.get('outDir'), getMomentFilename(ext));

    // capture the screen
    helper.takeScreenshot({ x, y, width, height }, ext, output, () => {
        helper.playSound('Grab');
    });
}

// Screen Shot 2017-02-18 at 12.26.00 AM
function getMomentFilename(extension) {
    return `Screen Shot ${moment().format('YYYY-MM-DD')} at ${moment().format('h.mm.ss A')}.${extension}`;
}

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
    shortcut.unregisterAll();
});

// ipc main stuff
ipcMain.on('close-window', event => {
    BrowserWindow.fromWebContents(event.sender).close();
});

// update shortcut
ipcMain.on('update-shortcut', (event, accelerator) => {
    // unregister old
    shortcut.unregister('take-screenshot');
    // register new
    registerShortcut(accelerator);
});

// disable and enable shortcuts
ipcMain.on('disable-shortcuts', shortcut.disableAll);
ipcMain.on('enable-shortcuts', shortcut.enableAll);
