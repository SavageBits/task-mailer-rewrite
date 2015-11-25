"use strict";

var gulp = require('gulp');
var connect = require('gulp-connect');
var open = require('gulp-open');

var config = {
    port: 9006,
    devBaseUrl: 'http://localhost',
    paths: {
        html: 'index.html',
        js: './src/**/*.js'
    },
    browser: 'firefox'
};

gulp.task('connect', function() {
    connect.server({
        root: ['.'],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true
    })
});

gulp.task('open', ['connect'], function() {
    gulp.src('')
        .pipe(open({
            app: config.browser,
            uri: config.devBaseUrl + ':' + config.port + '/'
        }))
});

gulp.task('html', function() {
    gulp.src('')
        .pipe(connect.reload());
});

gulp.task('js', function() {
    gulp.src('')
        .pipe(connect.reload());
});

gulp.task('watch', function() {
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.js, ['js']);
});

gulp.task('default', ['open', 'watch']);