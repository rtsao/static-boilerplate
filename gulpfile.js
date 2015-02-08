var path = require('path');
var gulp = require('gulp');
var jade = require('gulp-jade');
var data = require('gulp-data');

var pages = {
  dir: 'src/pages',
  glob: '**/*.jade'
};

gulp.task('pages', function() {
  return gulp.src(path.join(pages.dir, pages.glob))
    .pipe(data(function(file) {
      var relativeDir = path.relative(pages.dir, path.dirname(file.path))
      var page = path.join(relativeDir, path.basename(file.path, '.jade'));
      return {page: page};
    }))
    .pipe(jade())
    .pipe(gulp.dest('dist'));
});
