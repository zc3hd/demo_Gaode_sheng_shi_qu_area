'use strict';

const gulp = require('gulp');

const fs = require('fs');
const path = require('path');
const browsersync = require('browser-sync');

var dirname = path.resolve(__dirname,'./webapp');

var ms = null;
gulp.task('default', () => {
  ms = browsersync.create('My Server');
  ms.init({
    notify: false,
    server: dirname,
    index: './html/map/map_all_city.html',
    port: 1234,
    // tunnel: "myprivatesitecccccccccccc",
    logConnections: true
  });
  gulp.watch('./webapp/**/*', ['reload']);
  // gulp.watch('./src/index.html', ['html']);
  // gulp.watch('./src/styles/base.css', ['style']);
  // gulp.watch('./src/JS/*.js', ['js']);
});


gulp.task('reload', () => {
  ms.reload();
});



// const htmlmin = require('gulp-htmlmin');
// gulp.task('html', () => {
//   gulp.src('./src/index.html')
//     .pipe(htmlmin({ collapseWhitespace: true }))
//     .pipe(gulp.dest('./dist/'));
//   browsersync.reload();
// });

// const cssnano = require('gulp-cssnano');
// gulp.task('style', () => {
//   gulp.src('./src/styles/base.css')
//     .pipe(cssnano())
//     .pipe(gulp.dest('./dist/css'));
//   browsersync.reload();
// });

// const concat = require('gulp-concat');
// gulp.task('js', () => {
//   gulp.src('./src/JS/*.js')
//     .pipe(concat('core.js'))
//     .pipe(gulp.dest('./dist/scripts'));
//   browsersync.reload();
// });

// gulp.task('img', () => {
//   gulp.src('./src/images/*.*')
//     .pipe(gulp.dest('./dist/images'));
//   browsersync.reload();
// });
