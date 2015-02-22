# browserify-shim-angular-fail
Shows how Browserify-Shim in package.json fails to correctly shim angular.

How to run:
```javascript
npm install
npm run works // runs 'gulp works' then 'heads' the resulting output file
npm run fails // runs 'gulp fails' then 'heads' the resulting output file
```

NOTE: See how even the sizes of the output are different for works and fails:

```javascript
[12:09:59] Using gulpfile /Volumes/tempb/Development/browserify-shim-angular-fail/gulpfile.js
[12:09:59] Starting 'works'...
[12:10:01] all files 1.2 MB
[12:10:01] Finished 'works' after 1.57 s

[12:10:11] Using gulpfile /Volumes/tempb/Development/browserify-shim-angular-fail/gulpfile.js
[12:10:11] Starting 'fails'...
[12:10:12] all files 953.17 kB
[12:10:12] Finished 'fails' after 779 ms
```

Here is the transform applied in package.json:

```javascript
"browser": {
    "angular": "./node_modules/angular/angular.js"
  },
  "browserify": {
    "transform": [
      [
        "browserify-shim",
        {
          "global": true
        }
      ]
    ]
  },
  "browserify-shim": {
    "angular": {
      "exports": "angular",
      "depends": [
        "jquery:jQuery"
      ]
    }
  }
```

Although angular requires jQuery, the resulting output file **DOES NOT** contain jQuery.

Instead, need to apply the transform via javascript code:

```javascript
gulp.task('works', function () {
	var b = browserify({
		// Enable source maps!
		debug: true
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
		.pipe(gulp.dest('./build'))
});
```

