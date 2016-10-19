function serve(gulp, $) {
	'use strict';
	var browserSync = require('browser-sync'),
		connect = require('gulp-connect-php'),
		reload = browserSync.reload;

	function serve() {
		browserSync({
			browser: ["google-chrome"],
			server: {
				baseDir: "./"
			}
		});
		gulp.watch(['app/styles/**/*.scss  ', 'app/routes/**/*.scss', 'app/components/**/*.scss'], ['styles', reload]);
		gulp.watch(['app/*.html', 'app/**/*.html'], ['html', reload]);
		gulp.watch(['app/components/**/*.js', 'app/*.js', 'app/routes/**/*.js', 'app/services/**/*.js'], ['scripts', reload]);
		gulp.watch(['app/php/*.php'], ['scripts', reload]);

	}

	return {
		serve: serve
	};
}

module.exports = serve;