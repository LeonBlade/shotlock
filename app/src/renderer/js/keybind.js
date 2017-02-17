import { htmlEncode } from 'htmlencode';

// all the special keys
const Keys = {};

// register all the keys
register(8,         'Backspace',    '⌫');
register(13,        'Enter',        '↩︎');
register(16,        'Shift',        '⇧');
register(17,        'Control',      '⌃');
register(18,        'Option',       '⌥');
register(27,        'Escape',       '⎋');
register(46,        'Delete',       '⌦');
register(37,        'Left',         '←');
register(38,        'Up',           '↑');
register(39,        'Right',        '→');
register(40,        'Down',         '↓');
register([91, 93],  'Command',      '⌘');

/**
 * Registers a new key into keys object
 * @param {Number} keyCode
 * @param {String} string
 * @param {String} character
 * @returns {Boolean}
 */
function register(keyCode, string, character) {
    if (Keys.hasOwnProperty(keyCode) || Keys.hasOwnProperty(string))
        return false;
    const entry = { keyCode, html: htmlEncode(character), string };
    if (Array.isArray(keyCode))
        for (let key of keyCode)
            Keys[key] = entry;
    else
        Keys[keyCode] = entry;
    Keys[string] = entry;
}

// binds element
function bind(element) {
    // key state object
    const keyState = {
        modifiers: [],
        key: 0
    };

    // on key down
    element.addEventListener('keydown', e => {
        switch (e.keyCode) {

        }
    });

    // on key up
    element.addEventListener('keyup', e => {
        switch (e.keyCode) {
            case KEY_DELETE:
            case KEY_SHIFT:
            case KEY_CONTROL:
            case KEY_OPTION:
            case KEY_ESCAPE:
            case KEY_COMMAND:
                unset(keyState.modifiers, e.keyCode);
                break;
        }
    });

    return {
        getDisplayString: () => {

        }
    };
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
