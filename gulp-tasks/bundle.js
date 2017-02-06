function bundle(gulp, $) {

    var browserify = require('browserify'),
        source = require('vinyl-source-stream'),
        glob = require('glob'),
        path = require('path'),
        concat = require('gulp-concat'),
        rename = require('gulp-rename'),
        uglify = require('gulp-uglify'),
        buffer = require('vinyl-buffer');

    $.paths.bundle = {
        resources: [
            './node_modules/angular/angular.js',
            './node_modules/angular-ui-router/release/angular-ui-router.min.js',
            './node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
            './node_modules/angular-animate/angular-animate.min.js',
            './node_modules/angular-sanitize/angular-sanitize.min.js',
            './node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
            './bower_components/angular-ui-switch/angular-ui-switch.min.js'
        ]
    };


    function buildLibs() {
        return browserify($.paths.bundle.resources)
            .bundle()
            .pipe(source("libs.bundle.js"))
            .pipe(rename('libs.bundle.min.js'))
            .pipe(buffer())
            .pipe(uglify())
            .pipe(gulp.dest("./dist"));
    }

    function buildApp() {
        var files = glob.sync('./app/*.js', './app/**/**/*.js');
        return browserify({ entries: files }, { debug: true })
            .bundle()
            .pipe(source("app.bundle.js"))
            .pipe(rename('app.bundle.min.js'))
            .pipe(buffer())
            // .pipe(uglify())
            .pipe(gulp.dest("./dist"));
    }

    return {
        buildLibs: buildLibs,
        buildApp: buildApp
    };
}

module.exports = bundle;