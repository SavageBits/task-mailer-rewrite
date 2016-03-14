"use strict";

var gulp = require('gulp');
var connect = require('gulp-connect');
var open = require('gulp-open');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate'); //handles dependency injection annotations for minification safety
var concat = require('gulp-concat');
var os = require('os');

var config = {
  port: 9006,
  devBaseUrl: 'http://localhost',
  paths: {
    rootDirectory: '.',
    html: [
      'index.html',
      './app/src/**/*.html'
    ],
    js: './app/src/**/*.js'
  },
  bundle: 'bundle.js',
  browser: os.platform() === 'win32' ? 'chrome' : 'google chrome'
};

gulp.task('connect', function() {
    return connect.server({
        root: [config.paths.rootDirectory],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true
    })
});

gulp.task('open', ['connect'], function() {
    return gulp.src('')
        .pipe(open({
            app: config.browser,
            uri: config.devBaseUrl + ':' + config.port + '/'
        }))
});

gulp.task('html', function() {
    gulp.src(config.paths.html)
        .pipe(connect.reload());
});

gulp.task('js', function() {
    gulp.src(config.paths.js)
        .pipe(ngAnnotate())
        .pipe(concat(config.bundle))
        //.pipe(uglify())
        .pipe(gulp.dest(config.paths.rootDirectory))
        .pipe(connect.reload());
});

gulp.task('watch', function() {
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.js, ['js']);
});

gulp.task('default', ['js', 'open', 'watch']);
