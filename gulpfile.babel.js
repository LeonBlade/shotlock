import {src, dest, watch as watchSrc, series, parallel} from 'gulp';
import babel from 'gulp-babel';
import del from 'del';
import postcss from 'gulp-postcss';
import pug from 'gulp-pug';

// directories
const SRC_DIR = 'app/src';
const DIST_DIR = 'app/dist';

// source files
const JS_GLOB = `${SRC_DIR}/**/*.js`;
const CSS_GLOB = `${SRC_DIR}/**/*.css`;
const VIEWS_GLOB = `${SRC_DIR}/**/*.pug`;

// clean dist directory
export function clean() {
    return del([DIST_DIR]);
}

// js task
export function scripts() {
    return src(JS_GLOB, {base: SRC_DIR})
        .pipe(babel())
        .pipe(dest(DIST_DIR));
}

// view task
export function views() {
    return src(VIEWS_GLOB, {base: SRC_DIR})
        .pipe(pug())
        .pipe(dest(DIST_DIR));
}

// css task
export function styles() {
    return src(CSS_GLOB, {base: SRC_DIR})
        .pipe(postcss())
        .pipe(dest(DIST_DIR));
}

// watch task
export function watch() {
    watchSrc(JS_GLOB, scripts);
    watchSrc(CSS_GLOB, styles);
    watchSrc(VIEWS_GLOB, views);
}

const mainTasks = parallel(scripts, styles, views);
export const build = series(clean, mainTasks);
export const dev = series(clean, mainTasks, watch);

export default build;
