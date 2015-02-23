var del = require('del');
var path = require('path');
var gulp = require('gulp');
var data = require('gulp-data');
var jade = require('gulp-jade');
var less = require('gulp-less');
var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var hygienist = require('hygienist-middleware');

/**
 * Config
 */

var pages = {
  dir: 'src/pages',
  glob: '**/*.jade',
  dest: 'dist'
};

var styles = {
  dir: 'src/styles',
  glob: 'main.less',
  dest: 'dist/stylesheets'
};

var images = {
  dir: 'src/assets/images',
  glob: '**/*',
  dest: 'dist/assets/images'
};

var assets = {
  dir: 'src/assets',
  glob: '(!images)/**/*',
  dest: 'dist/assets'
}

function source(options) {
  return path.join(options.dir, options.glob);
}

/**
 * Tasks
 */

gulp.task('pages', ['clean'], function() {
  return gulp.src(source(pages))
    .pipe(data(function(file) {
      var relativeDir = path.relative(pages.dir, path.dirname(file.path))
      var pageName = path.join(relativeDir, path.basename(file.path, '.jade'));
      return {page: pageName};
    }))
    .pipe(jade())
    .pipe(gulp.dest(pages.dest));
});

gulp.task('styles', ['clean'], function() {
  return gulp.src(source(styles))
    .pipe(less({paths:['node_modules/normalize.css']}))
    .pipe(autoprefixer())
    .pipe(gulp.dest(styles.dest));
});

gulp.task('images', function () {
  return gulp.src(source(images))
    .pipe(changed(images.dest))
    .pipe(imagemin())
    .pipe(gulp.dest(images.dest));
});

gulp.task('copy-assets', function () {
  return gulp.src(source(assets))
    .pipe(gulp.dest(assets.dest));
});

gulp.task('clean', function(cb) {
  del(['dist'], cb);
});

gulp.task('server', function() {
  browserSync({
    notify: false,
    server: {
      middleware: hygienist('dist'),
      baseDir: 'dist'
    }
  });
});

gulp.task('build', ['pages', 'styles']);

