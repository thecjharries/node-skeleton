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
const merge = require('merge-stream');
const mocha = require('gulp-mocha');
const plumber = require('gulp-plumber');
const prettify = require('gulp-jsbeautifier');
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
    errorHandler: function(err) {
        gutil.log(err);
        this.emit('end');
    }
};

// Instance of gulp watcher
let watcher;

function assignAndStartWatcher() {
    gutil.log('Starting watcher');
    if (watcher) {
        stopAndNullWatcher();
    }
    watcher = gulp.watch(mainFilesToWatch, ['watch:post']);
}

function buildArrayOfStreamsToMergeFromObject(objectWithFunctionsThatReturnStreams) {
    let streams = [];
    for (let task in objectWithFunctionsThatReturnStreams) {
        if (objectWithFunctionsThatReturnStreams.hasOwnProperty(task)) {
            streams.push(objectWithFunctionsThatReturnStreams[task]());
        }
    }
    return streams;
}

function stopAndNullWatcher() {
    let wasWatched = false;
    if (watcher) {
        gutil.log('Killing watcher');
        watcher.end();
        wasWatched = true;
    }
    watcher = null;
    return wasWatched;
}

function mergeStreamsWithEndCallback(arrayOfStreams, callback = null) {
    let streams = merge(arrayOfStreams);
    if (callback) {
        streams.on('end', callback);
    }
    return streams;
}

let gulpTasks = {
    parallel: {
        lint: function() {
            return gulp
                .src(mainFilesToWatch)
                .pipe(plumber(plumberOptions))
                .pipe(jshint('./.jshintrc'))
                .pipe(jshint.reporter('jshint-stylish'));
        },
        todo: () => {
            return gulp
                .src(mainFilesToWatch)
                // Prevent stream  errors from killing gulp
                .pipe(plumber(plumberOptions))
                .pipe(todo())
                .pipe(gulp.dest('./'));
        }
    },
    post: {
        prettify: function() {
            return gulp.src(mainFilesToWatch.concat('./gulpfile.js'))
                .pipe(prettify({
                    indent_size: 4,
                    indent_char: ' ',
                    js: {
                        indent_size: 4,
                        keep_array_indentation: true
                    }
                }))
                .pipe(prettify.reporter())
                .pipe(gulp.dest(function(file) {
                    return file.base;
                }));
        }
    }
};

// Straight from the docs
gulp.task('doc:build', ['todo'], function(cb) {
    let config = require('./jsdoc.json');
    return gulp
        .src(
            mainFilesToWatch, {
                read: false
            }
        )
        .pipe(jsdoc(config, cb));
});

gulp.task('doc:server', ['doc:build'], function() {
    return gulp
        .src('./docs/jsdoc/')
        .pipe(webserver({
            host: '0.0.0.0',
            livereload: true,
            // directoryListing: true,
            open: true
        }));
});
gulp.task('lint', gulpTasks.parallel.lint);
gulp.task('mocha', function() {
    return gulp.src(testFiles, {
            read: false
        })
        .pipe(mocha({
            reporter: 'spec'
        }))
        .on('error', function(error) {
            if (typeof error.failed !== 'undefined' && error.failed === true) {
                let failedTestIndicator = /([1-9][0-9]*) failing/gi;
                if (typeof error.message !== 'undefined' && error.message.length > 0 && !error.message.match(failedTestIndicator)) {
                    gutil.error(error.message);
                } else {
                    gutil.log('Some tests failed, ya dingus');
                }
            }
            this.emit('end');
        });
});
gulp.task('prettify', gulpTasks.post.prettify);
gulp.task('todo', gulpTasks.parallel.todo);
gulp.task('watch:start', assignAndStartWatcher);
gulp.task('watch:parallel', ['watch:start'], function() {
    return merge(buildArrayOfStreamsToMergeFromObject(gulpTasks.parallel));
});
gulp.task('watch:stop', ['watch:parallel'], stopAndNullWatcher);
gulp.task('watch:post', ['watch:stop'], function() {
    return mergeStreamsWithEndCallback(
        buildArrayOfStreamsToMergeFromObject(gulpTasks.post),
        assignAndStartWatcher
    );
});
gulp.task('watch', ['watch:start']);

gulp.task('default', ['watch']);