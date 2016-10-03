function styleTasks(gulp, $){

	var path = require('path');
	$.paths.styles = {
		components: 'app/**/*.scss',
		resources: ['app/**/*', '!app/**/*.scss','!app/**/*.js','app/**/*.map','!app/**/*.html']
	};

	var AUTOPREFIXER_BROWSERS = [
	  'ie >= 10',
	  'ie_mob >= 10',
	  'ff >= 30',
	  'chrome >= 34',
	  'safari >= 7',
	  'opera >= 23',
	  'ios >= 7',
	  'android >= 4.4',
	  'bb >= 10'
	];

	function sass(){
		return gulp.src([$.paths.styles.components])
			.pipe($.sass())
			.pipe(gulp.dest($.paths.out));
	}

	function autoprefixAndMin(){
		return;
	}

	function moveResourcesToDist() {
	    return gulp.src($.paths.styles.resources)
			.pipe(gulp.dest($.paths.out));
	}


	return {
		styles:sass,
		autoprefixAndMin: autoprefixAndMin,
		moveResourcesToDist: moveResourcesToDist
	};

}

module.exports = styleTasks;
