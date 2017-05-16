/* eslint linebreak-style: ["error", "windows"]*/
import gulp from 'gulp';
import babel from 'gulp-babel';
import jasmineNode from 'gulp-jasmine-node';
import istanbul from 'gulp-babel-istanbul';
import injectModules from 'gulp-inject-modules';
import coveralls from 'gulp-coveralls';

gulp.task('transpile', () =>
gulp.src(['src/**.js', 'tests/**.js', 'index.js'])
.pipe(babel()).pipe(gulp.dest('dist')));

gulp.task('run-tests', ['transpile'], () =>
gulp.src(['tests/**.js'])
.pipe(jasmineNode()));

gulp.task('coverage', (cb) => {
  gulp.src(['src/**.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', () => {
      gulp.src('tests/**.js')
      .pipe(babel())
      .pipe(injectModules())
      .pipe(jasmineNode())
      .pipe(istanbul.writeReports())
      .pipe(istanbul.enforceThresholds({ thresholds: { global: 50 } }))
      .on('end', cb);
    });
});

gulp.task('coveralls', ['coverage'], () =>
gulp.src('coverage/lcov.info')
.pipe(coveralls()));

gulp.task('default', ['run-tests', 'coveralls']);
