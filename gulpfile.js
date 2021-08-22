const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const del = require('rimraf');
const sass = require("gulp-sass");
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require("browser-sync").create();
const purgecss = require('gulp-purgecss')
const htmlmin = require('gulp-htmlmin')
const terser = require('gulp-terser');




var config = {
    server: {
        baseDir: "./out"
    },
    host: '192.168.1.137',
    port: 9000
};
var concatjsdes = [
    'js/bootstrap.js'
];

var concatcss = ['./css/css.scss'];
gulp.task('html:build', function () {
    gulp.src('./*.html')
        .pipe(gulp.dest('./out')); 
});
gulp.task("clean:js", function (cb) {
    del('./out/js/*.js', cb);
});
gulp.task("clean:css", function (cb) {
    del('./out/css/*.css', cb);
});
gulp.task("clean:html", function (cb) {
    del('./out/*.html', cb);
});
gulp.task("clean:map", function (cb) {
    del('./**/*.map', cb);
});

gulp.task("clean:htmlandmap", gulp.series("clean:html", "clean:map"));
gulp.task("clean:asset", gulp.series("clean:js", "clean:css"));

gulp.task("clean", gulp.series("clean:htmlandmap", "clean:asset"));
gulp.task("min:css", function() {
    return gulp.src(concatcss)
         .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cleanCSS({ level: 2 }))
        // .pipe(purgecss({
        //     content: ['./*.html','./js/**/*.js']
        // }))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("./out/css/"))
        .pipe(browserSync.stream());
});

gulp.task("min:js", function () {
    return gulp.src(concatjsdes)
        .pipe(concat("script.js"))
        .pipe(terser())
        .pipe(gulp.dest("./out/js/"))
        .pipe(browserSync.stream());
});
gulp.task("min:html", function () {
    return gulp.src("./*.html")
        .pipe(htmlmin({ collapseWhitespace: true,removeComments: true }))
        .pipe(gulp.dest("./out/"))
        .pipe(browserSync.stream());
});
gulp.task("min:asset", gulp.series("min:css", "min:js"));
gulp.task("min", gulp.series("min:html", "min:asset"));
gulp.task("watch", function () {
    gulp.watch('./js/**/*.js', gulp.series("clean:js", "min:js"));
    gulp.watch('./css/**/*.scss', gulp.series("clean:css", "min:css"));
    gulp.watch('./*.html', gulp.series("clean:html", "min:html"));
});
gulp.task('webserver', function () {
    browserSync.init(config);
});
gulp.task("startwatch", gulp.parallel("watch", "webserver"));
gulp.task("build", gulp.series("clean", "min"));
gulp.task("run", gulp.series("build", "startwatch"));
gulp.task("release", gulp.series("build", "clean:map"));

