function html(gulp, $){

	function moveHtml(){
		gulp.src('./app/**/*.html')
		.pipe(gulp.dest('./dist'));
	}

	return {
		moveHtml: moveHtml
	};
}

module.exports = html;