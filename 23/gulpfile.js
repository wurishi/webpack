const gulp = require('gulp');
const webpack = require('webpack-stream');
const webpackConfig = require('./webpack.config');
gulp.task('default', function () {
  return gulp
    .src('./src/index.js') //
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('./dist'));
});
