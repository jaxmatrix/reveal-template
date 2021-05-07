const { src, dest, series, parallel, watch } = require("gulp");
const babel = require("gulp-babel");
const del = require('del');
const sass = require('gulp-sass');
const sync = require('browser-sync').create();

const unchanged = [
  'src/index.html',
  'src/img/*'
]

const revealStyles = [
  'node_modules/reveal.js/dist/reveal.css',
  'node_modules/reveal.js/dist/reset.css'
]

const revelThemes = [
  'node_modules/reveal.js/dist/theme/**'
]

const reveal_js = [
  'node_modules/reveal.js/dist/reveal.js'
]

const reveal_js_plugins = [
  'node_modules/reveal.js/plugin/**/*'
]

function cp_index() {

  return src('src/index.html')
    .pipe(dest('build/'));
}

function cp_img() {
  return src('src/img/*')
    .pipe(dest('build/img'));
}

function cp_reveal_style() {
  return src(revealStyles)
    .pipe(dest('build/css'))
}


function cp_reveal_themes() {
  return src(revelThemes)
    .pipe(dest('build/css/theme'));
}

function cp_reveal_js() {
  return src(reveal_js)
  .pipe(dest('build/js'));
}

function cp_reveal_plugins() {
  return src(reveal_js_plugins)
    .pipe(dest('build/js/plugins'));
}

function transpileJS() {
  return src("src/**/*.js")
    .pipe(babel({
      presets: ["@babel/preset-env"]
    }))
    .pipe(dest("build/"))
    .pipe(sync.stream());
}

function transpileCSS() {
  return src('src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(dest('build/css'))
    .pipe(sync.stream());
}

function clean() {
  return del(['build/**']);
}

function watchFiles() {
  sync.init({
    server : {
      baseDir: "./build"
    }
  });

  watch('src/js/*.js', transpileJS);
  watch('src/sass/*', transpileCSS);
  watch('src/index.html', cp_index);
  watch('src/img/*', cp_img);
  watch('./build/**.html').on('change', sync.reload);
}

exports.js = transpileJS;
exports.clean = clean;
exports.sync = watchFiles;
exports.cp = parallel(cp_index, cp_img, cp_reveal_style, cp_reveal_themes, cp_reveal_js, cp_reveal_plugins);
exports.build = series(exports.cp, transpileJS, transpileCSS);
exports.default = series(clean, exports.build, exports.sync);
