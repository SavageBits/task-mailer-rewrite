"use strict";

var gulp = require('gulp');
var connect = require('gulp-connect');
var open = require('gulp-open');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate'); //handles dependency injection annotations for minification safety
var concat = require('gulp-concat');

var config = {
    port: 9006,
    devBaseUrl: 'http://localhost',
    paths: {
        html: [
          'index.html',
          './views/**/*.html'
        ],
        js: './js/src/**/*.js',
        bundleDest: './js'
    },
    browser: 'firefox'
};

gulp.task('connect', function() {
    return connect.server({
        root: ['.'],
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
        .pipe(concat('bundle.js'))
        //.pipe(uglify())
        .pipe(gulp.dest(config.paths.bundleDest))
        .pipe(connect.reload());
});

gulp.task('watch', function() {
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.js, ['js']);
});

gulp.task('default', ['open', 'js', 'watch']);
