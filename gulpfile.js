var config = require('./package.json');
var gulp = require('gulp');
var jscs = require('gulp-jscs');
var mocha = require('gulp-mocha');

gulp.task('test', function() {
  return gulp.
    src('./test/*').
    pipe(mocha({ reporter: 'nyan' })).
    on('error', function(error) {
      console.log(error);
    });
});

gulp.task('style', function() {
  return gulp.
    src('./lib/*').
    pipe(jscs(config.jscsConfig)).
    on('error', function(error) {
      console.log(error);
    });
});

gulp.task('watch', ['style', 'test'], function() {
  gulp.watch(['./lib/*', './test/*'], ['style', 'test']);
});
