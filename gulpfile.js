var gulp = require('gulp');
var runSequence = require('run-sequence');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var assign = Object.assign || require('object.assign');
var del = require('del');
var vinylPaths = require('vinyl-paths');
var nodemon = require('gulp-nodemon');
var sass = require('gulp-sass');

/*
  Task to clean up the dist-client and dist-server
  directories
 */
gulp.task('clean', function() {
  return gulp.src(['dist-client/', 'dist-server', 'assets/css'])
    .pipe(vinylPaths(del));
});

/*
  Task to compile server js code with babel
 */
gulp.task('build-server-js', function () {
  var compilerOptions = {
    modules: 'common',
    moduleIds: false,
    comments: false,
    compact: false,
    stage:2,
    optional: ["es7.decorators", "es7.classProperties"]
  };
  return gulp.src('src-server/**/*.js')
    .pipe(plumber())
    .pipe(changed('dist-server/', {extension: '.js'}))
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write({includeContent: false, sourceRoot: '/src-server/' }))
    .pipe(gulp.dest('dist-server/'));
});

/*
  Task to compile client js code with babel
 */
gulp.task('build-client-js', function () {
  return gulp.src('src-client/**/*.js')
    .pipe(plumber())
    .pipe(changed('dist-client/', {extension: '.js'}))
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write({includeContent: false, sourceRoot: '/src-client/' }))
    .pipe(gulp.dest('dist-client/'));
});


/*
  Compile sass into CSS
 */
gulp.task('sass', function() {
    return gulp.src("scss/**/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("dist-client/"));
});

/*
  Task to copy client html files from src to dist
 */
gulp.task('build-client-html', function () {
  return gulp.src('src-client/**/*.html')
    .pipe(changed('dist-client/', {extension: '.html'}))
    .pipe(gulp.dest('dist-client/'));
});

/*
  Task to clean and build the entire application
 */
gulp.task('build', function(callback) {
  return runSequence('clean', ['build-server-js', 'sass', 'build-client-js', 'build-client-html'], callback);
});

/*
  Task to start up the server with nodemon and
  rebuild/restart if any source changes
 */
gulp.task('nodemon', ['build'], function () {
  nodemon({
    watch: ['./src-client', './src-server', './scss'],
    ext: 'js,html,scss',
    script: './dist-server/server.js',
    tasks: ['build']
  });
});

/*
  Task to start up the server in debug mode with nodemon and
  rebuild/restart if any source changes
 */
gulp.task('debug', ['build'], function () {
  nodemon({
    watch: ['./src-client', './src-server', 'scss'],
    ext: 'js,html,scss',
    script: './dist-server/server.js',
    tasks: ['build'],
    env: { 'DEBUG' : 'aether:*,server,express:*' }
  });
});

/*
  Point default task to nodemon
 */
gulp.task('default', ['nodemon']);
