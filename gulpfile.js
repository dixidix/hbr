var gulp = require('gulp'),
sass = require('gulp-sass'),
browserify = require('browserify'),
source = require('vinyl-source-stream'),
path = require('path'),
$ = require('gulp-load-plugins')();
$.paths = {
	html: {
		all: 'app/**/*.html',
		app:'app/index.html',
		routes:['app/routes/**/*template.html']
	},
	rescApp:['./app/app.js'],
	app: 'app',
	tmp: 'tmp',
	out: 'dist'
};

function getTasks(groupName) {
	return require('./gulp-tasks/' + groupName)(gulp, $);
}

var scriptTasks = getTasks('scripts'),
styleTasks = getTasks('styles'),
htmlTasks = getTasks('html'),
serveTasks = getTasks('serve'),
bundleTask = getTasks('bundle');


gulp.task('moveJSToDist', function(){
	return scriptTasks.moveToDist();
});
gulp.task('scripts',['moveJSToDist','bundleLibs', 'bundleApps'], function(){
	return scriptTasks.moveScripts();
});
gulp.task('sass', function(){
	return styleTasks.styles();
});
gulp.task('styles', ['sass', 'resources'], function(){
	return styleTasks.autoprefixAndMin();
});

gulp.task('resources', function () {
	return styleTasks.moveResourcesToDist();
});

gulp.task('html', function(){
	return htmlTasks.moveHtml();
});
gulp.task('bundleLibs', function(){
	return bundleTask.buildLibs();
});
gulp.task('bundleApps', function(){
	return bundleTask.buildApp();
});
gulp.task('serve', ['html','scripts','styles','bundleLibs', 'bundleApps'], function () {
	return serveTasks.serve();
});