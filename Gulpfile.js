// Using: https://github.com/geekflyer/gulp-ui5-preload

// Imports
// --------

var del = require('del');
var gulp = require('gulp');
var serve = require('gulp-serve');
var docco = require('gulp-docco');
var eslint = require('gulp-eslint');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var prettydata = require('gulp-pretty-data');

// Config
// -------

var destDocco = './docco';
var destResources = './resources';

// Local web server
// ----------------

gulp.task('serve', serve({
  root: ['./'],
  port: 8125,
  https: false,
}));

// Manage resources
// ----------------

gulp.task('clean', function () {
  return del([destDocco, destResources]);
});

var packagesToCopy = [
                 'bower_components/openui5-sap.ui.core/resources/**/*',
                 'bower_components/openui5-themelib_sap_bluecrystal/resources/**/*',
                 'bower_components/lodash/dist/**/*'];

gulp.task('setup', function () {
  return gulp.src(packagesToCopy)
    .pipe(gulp.dest(destResources));
});

// Manage our code
// --------------

// generate documentation
gulp.task('docco', function () {
  gulp.src(["./**/*.js", '!resources/**', '!bower_components/**',
                   '!node_modules/**'])
    .pipe(docco())
    .pipe(gulp.dest(destDocco))
});

// check javascript source
gulp.task('eslint', function () {
  return gulp.src(['**/*.js', '!resources/**', '!bower_components/**',
                   '!node_modules/**', '!Gulpfile.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError());
});

// Default
// --------

gulp.task('default', ['eslint', 'docco']);
