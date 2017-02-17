import { htmlEncode } from 'htmlencode';

// all the special keys
const Keys = {};

// register all the keys
register(8,  'Backspace',    '⌫');
register(13, 'Enter',        '↩︎');
register(16, 'Shift',        '⇧');
register(17, 'Control',      '⌃');
register(18, 'Option',       '⌥');
register(27, 'Escape',       '⎋');
register(32, 'Space',        'Space');
register(46, 'Delete',       '⌦');
register(37, 'Left',         '←');
register(38, 'Up',           '↑');
register(39, 'Right',        '→');
register(40, 'Down',         '↓');
register(91, 'Command',      '⌘');

const invalid = [9, 16, 17, 18, 20, 91, 93];

/**
 * Registers a new key into keys object
 * @param {Number} keyCode
 * @param {String} string
 * @param {String} character
 * @returns {Boolean}
 */
function register(keyCode, string, character) {
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
function bind(element, defaultValue = '') {
    // set the keystate
    element.dataset.acellerator = parseAccelerator(defaultValue);

    element.addEventListener('focus', () => {
        element.value = '';
    });

    element.addEventListener('keyup', keypress);
    element.addEventListener('keydown', keypress);

    function keypress(e) {
        console.log(e);
        let valueString = '';
        if (e.ctrlKey)      valueString += Keys['control'].raw;
        if (e.altKey)       valueString += Keys['option' ].raw;
        if (e.shiftKey)     valueString += Keys['shift'  ].raw
        if (e.metaKey)      valueString += Keys['command'].raw;

        if (invalid.indexOf(e.keyCode) == -1) {
            if (e.type == 'keydown')
                valueString += getKeyChar(e.keyCode);
            // check if valid
            if (e.ctrlKey || e.altKey  || e.metaKey)
                element.blur();
        }
        element.value = valueString;
    }
}

/**
 * Parses accelerator value
 * @param {String} value
 * @returns {Object}
 */
function parseAccelerator(value) {
    const parts = value.split('+');
    const keyState = {
        modifiers: [],
        key: 0
    };
    for (let part of parts) {
        const _part = part.toLowerCase();
        switch (_part) {
            case 'control':
            case 'command':
            case 'shift':
            case 'option':
                //Keys[_part][]
                break;
        }
    }
}

/**
 * Get the key char from key code
 * @param {Number} keyCode
 * @returns {String}
 */
function getKeyChar(keyCode) {
    if (Keys.hasOwnProperty(keyCode))
        return Keys[keyCode].raw;
    return String.fromCharCode((96 <= keyCode) ? keyCode - 48 * Math.floor(keyCode / 48) : keyCode);
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
