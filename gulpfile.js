var del = require('del');
var path = require('path');
var gulp = require('gulp');
var data = require('gulp-data');
var jade = require('gulp-jade');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');

var pages = {
  dir: 'src/pages',
  glob: '**/*.jade',
  dest: 'dist'
};

gulp.task('pages', ['clean'], function() {
  return gulp.src(path.join(pages.dir, pages.glob))
    .pipe(data(function(file) {
      var relativeDir = path.relative(pages.dir, path.dirname(file.path))
      var pageName = path.join(relativeDir, path.basename(file.path, '.jade'));
      return {page: pageName};
    }))
    .pipe(jade())
    .pipe(gulp.dest(pages.dest));
});

var styles = {
  dir: 'src/styles',
  glob: 'main.less',
  dest: 'dist/stylesheets'
};

gulp.task('styles', ['clean'], function() {
  return gulp.src(path.join(styles.dir, styles.glob))
    .pipe(less({paths:['node_modules/normalize.css']}))
    .pipe(autoprefixer())
    .pipe(gulp.dest(styles.dest));
});

gulp.task('clean', function(cb) {
  del(['dist'], cb);
});

gulp.task('build', ['pages', 'styles']);
