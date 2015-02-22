var gulp = require('gulp');
var size = require('gulp-size');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');

// NO BROWSERIFY SHIM TRANSFORM APPLIED BELOW B/C DEFINED IN PACKAGE.JSON
// BUT IT DOESN'T WORK
gulp.task('fails', function () {
	var b = browserify({
		// Enable source maps!
		debug: false
	});

	b.require('angular');

	return b.bundle()
		.pipe(source('fails_bundle.js'))
		.pipe(buffer())
		.pipe(size())
		.pipe(gulp.dest('./build'))
});

// BROWSERIFY SHIM TRANSFORM APPLIED BELOW AND DOES SHIM ANGULAR
// BUT REALLY THIS SHOULD SHIM ANGULAR TWICE (bad) b/c browserify-shim
// SHOULD NOW BE APPLIED TWICE...BUT ITS ONLY APPLIED ONCE
gulp.task('works', function () {
	var b = browserify({
		// Enable source maps!
		debug: false
	});

	// Need to manually apply global=true transform here
	// Setting this in package.json FAILS for angular...no idea why
	// See: https://github.com/thlorenz/browserify-shim/issues/143
	b.transform('browserify-shim', {
		global: true
	});

	b.require('angular');

	return b.bundle()
		.pipe(source('works_bundle.js'))
		.pipe(buffer())
		.pipe(size())
		.pipe(gulp.dest('./build'))
});