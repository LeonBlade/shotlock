import execa from 'execa';

const sounds = {
    'Grab': '/System/Library/Components/CoreAudio.component/Contents/SharedSupport/SystemSounds/system/Grab.aif'
};

function playSound(key) {
    execa('afplay', [ sounds[key] ]);
}

function takeScreenshot(bounds, format, output, callback) {
    const { x, y, width, height } = bounds;
    const args = [ '-t', format, `-R${x},${y},${width},${height}`, output ];
    execa('screencapture', args).then(() => {
        callback();
    });
}

export { playSound, takeScreenshot };
