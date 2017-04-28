/*
 * Super generic gulpfile.
 *     * JSHint default except for
 *     * TODO and JSDoc are more personal preference than anything else.
 *     * gulp-webserver is pretty neat, and possibly nicer than browser-sync
 */

const gulp = require('gulp');
const gutil = require('gulp-util');
const jsdoc = require('gulp-jsdoc3');
const jshint = require('gulp-jshint');
const plumber = require('gulp-plumber');
const todo = require('gulp-todo');
const webserver = require('gulp-webserver');

// Main source files
const sourceFiles = [
    './src/**/*'
];

// Main test files
const testFiles = [
    './test/**/*'
];

// Unused
// const ignoredFiles = [
//     '!./docs/**/*',
//     '!./node_modules/**/*'
// ];

// Glue everything together
const mainFilesToWatch = sourceFiles.concat(testFiles);

// Build generic plumber options
const plumberOptions = {
    errorHandler: function (err) {
        gutil.log(err);
        this.emit('end');
    }
};

// Straight from the docs
gulp.task('doc:build', ['todo'], function (cb) {
    let config = require('./jsdoc.json');
    return gulp
        .src(
            mainFilesToWatch,
            {
                read: false
            }
        )
        .pipe(jsdoc(config, cb));
});

gulp.task('doc:server', ['doc:build'], function () {
    return gulp

        .src('./docs/jsdoc/')
        .pipe(webserver({
            host: '0.0.0.0',
            livereload: true,
            // directoryListing: true,
            open: true
        }));
});

gulp.task('jshint', function () {
    return gulp
        .src(mainFilesToWatch)
        .pipe(plumber(plumberOptions))
        .pipe(jshint('./.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('todo', function () {
    return gulp
        .src(mainFilesToWatch)
        // Prevent stream  errors from killing gulp
        .pipe(plumber(plumberOptions))
        .pipe(todo())
        .pipe(gulp.dest('./'));
});

gulp.task('watch', function () {
    return gulp
        .watch(
            mainFilesToWatch,
            [
                'jshint',
                'todo'
            ]
        );
});

gulp.task('default', ['watch']);
