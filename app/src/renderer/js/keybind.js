import { remote } from 'electron';
const { app } = remote;
import { htmlEncode } from 'htmlencode';

// all the special keys
const Keys = {};

// register all the keys
register(27,  'Escape', '⎋');
register(112, 'F1');
register(113, 'F2');
register(114, 'F3');
register(115, 'F4');
register(116, 'F5');
register(117, 'F6');
register(118, 'F7');
register(119, 'F8');
register(120, 'F9');
register(121, 'F10');
register(122, 'F11');
register(132, 'F12');

register(192, '`');
register(9, 'Tab', '⇥');

// 0 - 9
for (let i = 48; i <= 57; i++)
    register(i, String.fromCharCode(i));

register(189, '-');
register(187, '=');
register(8, 'Backspace', '⌫'); register(46, 'Delete', '⌦');

// A - Z
for (let i = 65; i <= 90; i++)
    register(i, String.fromCharCode(i));

register(219, '[');
register(221, ']');
register(220, '\\');
register(186, ';');
register(222, '\'');
register(188, ',');
register(190, '.');
register(191, '/');

register(13, 'Enter', '↩︎');
register(16, 'Shift', '⇧');
register(17, 'Control', '⌃');
register(18, 'Option', '⌥');
register(32, 'Space');
register(37, 'Left', '←');
register(38, 'Up', '↑');
register(39, 'Right', '→');
register(40, 'Down', '↓');
register(91, 'Command', '⌘');

// keys not valid
const invalid = [16, 17, 18, 20, 91, 93];

/**
 * Registers a new key into keys object
 * @param {Number} keyCode
 * @param {String} string
 * @param {String} character
 * @returns {Boolean}
 */
function register(keyCode, string, character = string) {
    if (Keys.hasOwnProperty(keyCode) || Keys.hasOwnProperty(string.toLowerCase()))
        return false;
    const entry = { keyCode, html: htmlEncode(character), raw: character, string };
    if (Array.isArray(keyCode))
        for (let key of keyCode)
            Keys[key] = entry;
    else
        Keys[keyCode] = entry;
    Keys[string.toLowerCase()] = entry;
}

// binds element
function bind(element, callback) {
    // set the keystate
    const accel = parseAccelerator(element.dataset.accelerator);
    // TODO: make this elegant this is shitty... but works
    keypress(Object.assign({ type: 'keydown' }, accel));

    // cache values
    let cacheValue, cacheAccelerator;

    // set element value to empty on focus
    element.addEventListener('focus', () => {
        cacheValue = element.value;
        cacheAccelerator = element.dataset.accelerator;
        element.value = '';
    });

    element.addEventListener('blur', () => {
        if (!element.value) {
            element.value = cacheValue;
            element.dataset.accelerator = cacheAccelerator;
        }
    });

    element.addEventListener('keyup', keypress);
    element.addEventListener('keydown', keypress);

    function keypress(e) {
        let valueString = '';

        // modifiers
        if (e.ctrlKey)      valueString += Keys['control'].raw;
        if (e.altKey)       valueString += Keys['option' ].raw;
        if (e.shiftKey)     valueString += Keys['shift'  ].raw
        if (e.metaKey)      valueString += Keys['command'].raw;

        // make sure its not an invalid key or its in the list of accepted keys
        if (invalid.indexOf(e.keyCode) == -1 && Keys.hasOwnProperty(e.keyCode)) {
            if (e.type == 'keydown')
                valueString += Keys[e.keyCode].raw;
            // check if valid
            if (e.ctrlKey || e.altKey  || e.metaKey) {
                element.blur();
                // get the accelerator string
                element.dataset.accelerator = createAccelerator(e);
                callback();
            }
        }
        element.value = valueString;
    }
}

/**
 * Create accelerator from key event
 * @param {Object} keyEvent
 * @returns {String}
 */
function createAccelerator(keyEvent) {
    const { ctrlKey, altKey, metaKey, shiftKey, keyCode } = keyEvent;
    let accel = [];
    if (ctrlKey)    accel.push(Keys.control.string);
    if (altKey)     accel.push(Keys.option.string);
    if (shiftKey)   accel.push(Keys.shift.string);
    if (metaKey)    accel.push(Keys.command.string);
    if (Keys.hasOwnProperty(keyCode))
        accel.push(Keys[keyCode].string);
    return accel.join('+');
}

/**
 * Parses accelerator value
 * @param {String} value
 * @returns {Object}
 */
function parseAccelerator(value) {
    const parts = value.split('+');
    console.log(value, parts);
    let keyCode, ctrlKey, altKey, shiftKey, metaKey;
    for (let part of parts) {
        const _part = part.toLowerCase();
        if (_part == Keys.control.string.toLowerCase())         ctrlKey = true;
        else if (_part == Keys.option.string.toLowerCase())     altKey = true;
        else if (_part == Keys.shift.string.toLowerCase())      shiftKey = true;
        else if (_part == Keys.command.string.toLowerCase())    metaKey = true;
        // only assuming one key code is valid
        else if (Keys.hasOwnProperty(_part)) keyCode = Keys[_part].keyCode;
        else return {};
    }
    return { keyCode, ctrlKey, altKey, shiftKey, metaKey  };
}

/**
 * Unique push only adds unique elements to array
 * @param {Array} arr
 * @param {mixed} value
 * @returns {Boolean}
 */
function upush(arr, value) {
    if (!Array.isArray(arr))
        return false;
    if (!isset(arr, value))
        return !!arr.push(value);
    return false;
}

/**
 * Returns whether or not a value is inside an array
 * @param {Array} arr
 * @param {mixed} value
 * @returns {Boolean}
 */
function isset(arr, value) {
    return Array.isArray(arr) && arr.indexOf(value) != -1;
}

/**
 * Removes an element from an array
 * @param {Array} arr
 * @param {mixed} value
 * @return {Boolean}
 */
function unset(arr, value) {
    if (!Array.isArray(arr))
        return false;
    if (isset(arr, value))
        return !!arr.splice(arr.indexOf(value), 1);
    return false;
}

export default bind;
