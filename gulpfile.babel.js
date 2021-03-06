import {src, dest, watch as watchSrc, series, parallel} from 'gulp';
import pug from 'gulp-pug';
import babel from 'gulp-babel';
import injectSvg from 'gulp-inject-svg';
import sourcemaps from 'gulp-sourcemaps';

import sass from 'gulp-sass';
import moduleImporter from 'sass-module-importer';

import del from 'del';

// directories
const SRC_DIR = 'app/src';
const DIST_DIR = 'app/dist';

// source files
const JS_GLOB = `${SRC_DIR}/**/*.js`;
const CSS_GLOB = `${SRC_DIR}/**/*.scss`;
const VIEWS_GLOB = `${SRC_DIR}/**/*.pug`;
const VIEWS_PARTIALS_GLOB = `${SRC_DIR}/**/_*.pug`;
const SVG_GLOB = `app/static/**/*.svg`;

// clean dist directory
export function clean() {
    return del([DIST_DIR]);
}

// js task
export function scripts() {
    return src(JS_GLOB, { base: SRC_DIR })
		.pipe(babel())
		.pipe(dest(DIST_DIR));
}

// view task
export function views() {
    return src([VIEWS_GLOB, `!${VIEWS_PARTIALS_GLOB}`], { base: SRC_DIR })
		.pipe(pug())
        .pipe(injectSvg())
		.pipe(dest(DIST_DIR));
}

// css task
export function styles() {
    return src(CSS_GLOB, { base: SRC_DIR })
        .pipe(sourcemaps.init())
		.pipe(sass({ importer: moduleImporter(), outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(sourcemaps.write())
		.pipe(dest(DIST_DIR));
}

// watch task
export function watch() {
    watchSrc(JS_GLOB, scripts);
    watchSrc(CSS_GLOB, styles);
    watchSrc(VIEWS_GLOB, views);
    watchSrc(SVG_GLOB, views);
}

const mainTasks = parallel(scripts, styles, views);
export const build = series(clean, mainTasks);
export const dev = series(clean, mainTasks, watch);

export default build;
