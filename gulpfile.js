const { src, dest, series, watch, task } = require("gulp"),
  browserSync = require("browser-sync"),
  sourcemaps = require("gulp-sourcemaps"),
  postcss = require("gulp-postcss"),
  cssnano = require("cssnano"),
  autoprefixer = require("autoprefixer"),
  terser = require("gulp-terser");

// File paths
const html = {
  src: "src/*.html",
  dist: "./",
};
const css = {
  src: "src/css/**/*.css",
  dist: "./css",
};
const js = {
  src: "src/js/**/*.js",
  dist: "./js",
};

// HTML task
htmlTask = () => {
  return src(html.src).pipe(dest(html.dist));
};

// CSS task
cssTask = () => {
  return src(css.src)
    .pipe(sourcemaps.init())
    .pipe(postcss([autoprefixer(), cssnano()])) // Postcss and plugins
    .pipe(sourcemaps.write())
    .pipe(dest(css.dist));
};

// JavaScript Task
javascriptTask = () => {
  return src(js.src)
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(sourcemaps.write())
    .pipe(dest(js.dist));
};

// Browser sync serve
browserSyncServe = (callback) => {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });
  callback();
};
// Browser sync reload
browserSyncReload = (callback) => {
  browserSync.reload();
  callback();
};
// Browser sync watch
browserSyncWatch = () => {
  watch(
    [css.src, js.src, html.src],
    series(cssTask, javascriptTask, htmlTask, browserSyncReload)
  );
};

exports.default = series(
  htmlTask,
  cssTask,
  javascriptTask,
  browserSyncServe,
  browserSyncWatch
);

