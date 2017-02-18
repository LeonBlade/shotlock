import { globalShortcut } from 'electron';

// list of running shortcuts
const shortcuts = {};

/**
 * Registers a managed shortcut
 * @param {String} name
 * @param {String} accelerator
 * @param {Function} callback
 */
function register(name, accelerator, callback) {
    // silent fail on registering existing name or existing registered accelerator
    if (shortcuts.hasOwnProperty(name) || globalShortcut.isRegistered(accelerator))
        return;
    // add shortcut to the registry
    shortcuts[name] = { accelerator, callback };
    // register the shortcut
    enable(name);
}

/**
 * Unregisters a managed shortcut
 * @param {String} name
 */
function unregister(name) {
    if (shortcuts.hasOwnProperty(name)) {
        globalShortcut.unregister(shortcuts[name].accelerator);
        delete shortcuts[name];
    }
}

/**
 * Unregisters all managed shorcuts
 */
function unregisterAll() {
    for (let shortcut in shortcuts)
        unregister(shortcut);
}

/**
 * Disables a managed shortcut
 * @param {String} name
 */
function disable(name) {
    if (shortcuts.hasOwnProperty(name))
        globalShortcut.unregister(shortcuts[name].accelerator);
}

/**
 * Disables all managed shortcuts
 * @param {String} name
 */
function disableAll() {
    for (let shortcut in shortcuts)
        disable(shortcut);
}

/**
 * Enables a managed shortcut
 * @param {String} name
 */
function enable(name) {
    if (shortcuts.hasOwnProperty(name))
        globalShortcut.register(shortcuts[name].accelerator, shortcuts[name].callback);
}

/**
 * Enables all managed shortcuts
 * @param {String} name
 */
function enableAll() {
    for (let shortcut in shortcuts)
        enable(shortcut);
}

export { register, unregister, disable, disableAll, enable, enableAll, unregisterAll };
