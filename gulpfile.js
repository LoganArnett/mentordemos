var gulp = require('gulp');

var concat = require('gulp-concat');
var minifyHTML = require('gulp-minify-html');
var imagemin = require('gulp-imagemin');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();
var source = require('vinyl-source-stream');
var browserify = require('browserify');

// Static Server + watching scss/html files
gulp.task('serve', ['scripts', 'browserify', 'sass'], function() {

    browserSync.init({
        server: "./"
    });

    gulp.watch("./scss/*.scss", ['sass']);
    gulp.watch("./*.html").on('change', browserSync.reload);
});

// JavaScript linting task
gulp.task('jshint', function() {
  return gulp.src('./js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Compile Sass task
gulp.task('sass', function() {
  return gulp.src('./scss/*.scss')
    .pipe(sass({
      includePaths: require('node-bourbon').includePaths,
      includePaths: require('node-neat').includePaths
    }))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream());
});

// Minify index
gulp.task('html', function() {
  return gulp.src('./index.html')
    .pipe(minifyHTML())
    .pipe(gulp.dest('build/'));
});

// JavaScript build task, removes whitespace and concatenates all files
gulp.task('scripts', function() {
  return gulp.src('./js/*.js')
    .pipe(concat('main.js'))
    .pipe(uglify());
});

// Styles build task, concatenates all the files
gulp.task('styles', function() {
  return gulp.src('./css/*.css')
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('build/css'));
});

// Image optimization task
gulp.task('images', function() {
  return gulp.src('./img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('build/img'));
});

// Watch task
gulp.task('watch', function() {
  gulp.watch('./js/*.js', ['jshint']);
  gulp.watch('./scss/*.scss', ['sass']);
});

//browserify task
gulp.task('browserify', function() {
    return browserify('./js/main.js')
        .bundle()
        //Pass desired output filename to vinyl-source-stream
        .pipe(source('./js/app.js'))
        // Start piping stream to tasks!
        .pipe(gulp.dest('./build/'));
});

// Default task
gulp.task('default', ['jshint', 'sass', 'watch']);

// Build task
gulp.task('build', ['jshint', 'sass', 'html', 'scripts', 'browserify', 'styles', 'images']);
