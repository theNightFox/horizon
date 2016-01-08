const
 babel = require("gulp-babel"),
 babelify = require('babelify'),
 browserify = require('browserify'),
 buffer = require('vinyl-buffer'),
 gulp = require('gulp'),
 source = require('vinyl-source-stream'),
 sourcemaps = require('gulp-sourcemaps'),
 watchify = require('watchify');

function compileTestClient(){
  return gulp.src("src/index.js")
    .pipe(babel())
    .pipe(gulp.dest("dist/test.js"));
}

function compile(watch) {
  var bundler = watchify(browserify({
    entries: ['./src/index.js'],
    debug: true,
    sourceType: module,
  })
  .require("./src/index.js", {expose: "Fusion"})
  .transform(babelify));

function rebundle() {
    bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('build.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./dist'));
  }

  if (watch) {
    bundler.on('update', function() {
      console.log('-> bundling...');
      rebundle();
    });
  }

  rebundle();
}

function watch() {
  return compile(true);
};

gulp.task('build', function() { return compile(); });
gulp.task('watch', function() { return watch(); });
gulp.task('test', function() { return compileTestClient(); });

gulp.task('default', ['watch']);