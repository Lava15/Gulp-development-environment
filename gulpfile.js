import gulp from "gulp";
import { deleteAsync as del } from "del";
import imagemin from "gulp-imagemin";
import pug from "gulp-pug";
import plumber from "gulp-plumber";
import browsersync from "browser-sync";
import dartSass from "sass";
import gulpSass from "gulp-sass";
import minifycss from "gulp-minify-css";
import babel from "gulp-babel";
import uglify from "gulp-uglify";
import rename from "gulp-rename";
import autoprefixer from "gulp-autoprefixer";
import size from "gulp-size";

const sass = gulpSass(dartSass);

const pathSrc = "src/";
const pathBuild = "build/";

export const cleanBuild = () => {
  return del(["build/*", "!build/images"]);
};

const config = {
  pathSrc: {
    html: pathSrc + "pug/**/*.pug",
    style: pathSrc + "styles/**/*.scss",
    js: pathSrc + "js/**/*.*",
    fonts: pathSrc + "fonts/**/*.*",
    images: pathSrc + "images/**/*.*",
  },
  pathDest: {
    html: pathBuild,
    style: pathBuild + "styles/",
    js: pathBuild + "js/",
    fonts: pathBuild + "fonts/",
    images: pathBuild + "images/",
  },
  watch: {
    html: pathSrc + "pug/**/*.pug",
    style: pathSrc + "scss/**/*.scss",
    js: pathSrc + "js/**/*.*",
    fonts: pathSrc + "fonts/**/*.*",
    images: pathSrc + "images/**/*.*",
  },
};

const watchFiles = () => {
  gulp.watch(config.watch.html, gulp.series(pugTask));
  gulp.watch(config.watch.style, gulp.series(scssTask));
  gulp.watch(config.watch.js, gulp.series(jsTask));
  gulp.watch(config.watch.images, gulp.series(imgTask));
  gulp.watch(config.watch.fonts, gulp.series(fontsTask));
};

export const pugTask = () => {
  return gulp
    .src(config.pathSrc.html)
    .pipe(plumber())
    .pipe(pug())
    .pipe(gulp.dest(config.pathDest.html))
    .pipe(size())
    .pipe(browsersync.stream());
};

export const scssTask = () => {
  return gulp
    .src(config.pathSrc.style)
    .pipe(plumber())
    .pipe(sass())
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(minifycss())
    .pipe(
      rename({
        basename: "main",
        suffix: ".min",
      })
    )
    .pipe(size())
    .pipe(gulp.dest(config.pathDest.style))
    .pipe(browsersync.stream());
};

export const jsTask = () => {
  return gulp
    .src(config.pathSrc.js)
    .pipe(plumber())
    .pipe(babel())
    .pipe(uglify())
    .pipe(
      rename({
        basename: "main",
        suffix: ".min",
      })
    )
    .pipe(size())
    .pipe(gulp.dest(config.pathDest.js))
    .pipe(browsersync.stream());
};
export const imgTask = () => {
  return gulp
    .src(config.pathSrc.images)
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest(config.pathDest.images))
    .pipe(browsersync.stream());
};

const fontsTask = () => {
  return gulp
    .src(config.pathSrc.fonts)
    .pipe(plumber())
    .pipe(gulp.dest(config.pathDest.fonts))
    .pipe(size())

    .pipe(browsersync.stream());
};

export const browserSync = () => {
  browsersync.init({
    server: {
      baseDir: pathBuild,
    },
  });
};

export const build = gulp.series(
  cleanBuild,
  pugTask,
  scssTask,
  jsTask,
  fontsTask,
  imgTask
);
export const dev = gulp.series(build, gulp.parallel(watchFiles, browserSync));
export default gulp.series(dev);
