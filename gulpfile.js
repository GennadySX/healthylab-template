var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    watch = require("gulp-watch"),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglifyES = require('gulp-uglify-es').default,
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream')

/***SASS**/

gulp.task('sass', () => gulp.src('src/sass/**/*.sass')
    .pipe(sass().on('error', sass.logError))
    //.pipe(cssnano())
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7']), {cascade: true})
    .pipe(gulp.dest('src/assets/css'))
    .pipe(browserSync.reload({stream: true}))
)

/***JS**/

gulp.task('browserify',  () => browserify()
        .require('jquery')
        .require('bootstrap')
        .bundle()
        .pipe(source('libs.min.js'))
        .pipe(gulp.dest('src/assets/js')))


gulp.task('scripts', () => gulp.src('src/js/**/*.js')
    .pipe(uglifyES())
    .pipe(concat('main.min.js'))
    .pipe(browserSync.reload({stream: true}))
    .pipe(gulp.dest('src/assets/js')));



/***CSS_LIBS***/

gulp.task('css-libs', () => gulp.src('src/sass/**/*.+(scss | scss)')
    .pipe(sass())
    .pipe(cssnano())
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7']), {cascade: true})
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('src/assets/css'))
);


gulp.task('browser-sync', () => browserSync.init({server: {baseDir: "src"}, notify: false}));

gulp.task('html', () => gulp.src('src/*.html').pipe(browserSync.reload({stream: true})));

gulp.task('img', () => gulp.src('src/assets/img/**/*').pipe(cache(imagemin({
    interlaced: true,
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()]
})))
    .pipe(gulp.dest('dist/assets/img')));

gulp.task('watch', () => {
    gulp.watch('./src/sass/**/*.+(sass|scss)', gulp.series('sass'));
    gulp.watch('src/*.html', gulp.series('html'));
    gulp.watch(['src/js/**/*.js', 'src/libs/**/*.js'], gulp.parallel('scripts'));
});

gulp.task('clean', async () => del.sync('dist'));

gulp.task('bcss', () => gulp.src(['src/assets/css/*.css', 'src/assets/css/*.min.css'])
    .pipe(gulp.dest('dist/css')));

gulp.task('bfonts', () => gulp.src('src/assets/fonts/**/*')
    .pipe(gulp.dest('dist/assets/fonts')));

gulp.task('bjs', () => gulp.src('src/js/**/*.js')
    .pipe(gulp.dest('dist/js')));

gulp.task('bhtml', () => gulp.src('src/*.html')
    .pipe(gulp.dest('dist')));


gulp.task('build', gulp.parallel('clean', 'img', 'sass', 'scripts', 'bcss', 'bjs', 'bfonts', 'bhtml'));

gulp.task('start', gulp.parallel('sass', 'browser-sync', 'scripts','watch'));


gulp.task('clear', () => cache.clearAll());

