const gulp = require('gulp');
const browserSync = require('browser-sync').create();

const compileSCSS = require('../swiss-army-knife/gulp/compileSCSS');
const compileJS = require('../swiss-army-knife/gulp/compileJS');
const compileHTML = require('../swiss-army-knife/gulp/compileHTML');
const notify = require('../swiss-army-knife/gulp/notify');

const Log = require('../swiss-army-knife/js/_log');

const browserSyncOptions = {
	server: {
		baseDir: 'client/public'
	}
};

gulp.task('compile', ['compile-js', 'compile-css', 'compile-html']);

gulp.task('default', ['compile']);

gulp.task('dev', ['compile'], function(){
	browserSync.init(browserSyncOptions);

	gulp.watch('client/js/*.js', ['compile-js']);
	gulp.watch('client/js/**/*.js', ['compile-js']);
	gulp.watch('client/scss/*.scss', ['compile-css']);
	gulp.watch('client/html/*.html', ['update-html']);
});

gulp.task('dist', function(){
	gulp.src('server/*').pipe(gulp.dest('dist'));
	gulp.src('server/**/*').pipe(gulp.dest('dist'));

	gulp.src('client/public/js/*').pipe(gulp.dest('dist/public/js'));
	gulp.src('client/public/css/*').pipe(gulp.dest('dist/public/css'));
	gulp.src('client/public/html/*').pipe(gulp.dest('dist/public/html'));

	gulp.src('../swiss-army-knife/client/fonts/*').pipe(gulp.dest('dist/public/fonts'));

	gulp.src('../swiss-army-knife/js/_log.js').pipe(gulp.dest('dist'));
	gulp.src('../swiss-army-knife/js/_common.js').pipe(gulp.dest('dist'));

	notify('done!');
});

gulp.task('compile-js', function(){
	compileJS('client/js', 'client/public/js');
});

gulp.task('compile-css', function(){
	compileSCSS('client/scss', 'client/public/css');
});

gulp.task('compile-html', function(){
	// compileHTML('client/html', 'client/public/html');
	gulp.src('client/html/index.html').pipe(gulp.dest('client/public'));
});