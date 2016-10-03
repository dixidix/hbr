function scripts(gulp, $){

	var browserify = require('browserify');

	$.paths.js = {
		app: ['app/**/*.js','app/routes/**/*.js','app/components/**/*.js'],
		moveToDist : ['app/**/*.js','app/routes/**/*.js','app/components/**/*.js','app/**/*.php'],
		components:[
		'app/components/**/*.js',
		'app/routes/**/*.js'
		]
	};

	function moveToDist(){
		return gulp.src($.paths.js.moveToDist)		
		.pipe(gulp.dest($.paths.out));
	}

	function moveScripts(){
		return 	gulp.src('./app/scripts/**/*.js')
		.pipe(gulp.dest('./dist/scripts'));
	}

	return {
		moveScripts: moveScripts,
		moveToDist: moveToDist
	};
}

module.exports = scripts;
