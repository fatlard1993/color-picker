const fs = require('fs');

const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');//&& babel-preset-env
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();

const autoprefixerOptions = {
  browsers: ['last 2 versions', '> 1%'],
  cascade: false
};

const babelOptions = {
  presets: ['env']
};

const browserSyncOptions = {
  server: {
    baseDir: 'live'
  }
};

function concatJS(name, files, applyBabel){
  // console.log('concatJS', name, files);

  var proc = gulp.src(files).pipe(concat(name));

  if(applyBabel) proc.pipe(babel(babelOptions));

  proc.pipe(gulp.dest('live/js')).pipe(browserSync.stream());
}

gulp.task('default', ['compile']);

gulp.task('dev', ['compile'], function(){
  browserSync.init(browserSyncOptions);

  gulp.watch('src/js/**/*.js', ['compile-js']);
  gulp.watch('src/scss/*.scss', ['compile-css']);
  gulp.watch('src/*.html', ['update-html']);
});

gulp.task('compile', ['compile-js', 'compile-css', 'update-html']);

gulp.task('compile-js', function(){
  fs.readFile('src/js/output.json', function(err, data){
    var outputSettings = JSON.parse(data);

    console.log(outputSettings);

    concatJS(outputSettings.name, outputSettings.includes, outputSettings.babel);
  });
});

gulp.task('compile-css', function(){
  var proc = gulp.src('src/scss/*.scss').pipe(sass().on('error', sass.logError));

  proc.pipe(autoprefixer(autoprefixerOptions)).pipe(gulp.dest('live/css')).pipe(browserSync.stream());
});

gulp.task('update-html', function(){
  gulp.src('src/*.html').pipe(gulp.dest('live')).pipe(browserSync.stream());
});