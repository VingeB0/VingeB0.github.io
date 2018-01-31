var gulp         = require('gulp'), // Подключаем Gulp
    browserSync  = require('browser-sync'), // Подключаем Browser Sync
    sass         = require('gulp-sass'), //Подключаем Sass пакет,
    concat       = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    uglify       = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
    cssnano      = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
    rename       = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
    del          = require('del'), // Подключаем библиотеку для удаления файлов и папок
    imagemin     = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
    pngquant     = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
    autoprefixer = require('gulp-autoprefixer'),// Подключаем библиотеку для автоматического добавления префиксов
    plumber      = require('gulp-plumber'), //предохраняет задачи от остановки во время их выполнения
    cache        = require('gulp-cache'), // Подключаем библиотеку кеширования
    pug          = require('gulp-pug'), //Подключаем шаблонизатор для html PUG(jade)
    notify       = require("gulp-notify"), // Подключаем плагин для вывода ошибок
    spritesmith  = require("gulp.spritesmith"); // Подключаем модуль для сборки спрайтов

gulp.task('sass', function(){
    return gulp.src(['app/sass/**/main.sass', 'app/sass/**/libs.sass']) // 'app/sass/**/*.sass', Берем источник
        .pipe(plumber())
        .pipe(sass({outputStyle: 'expanded'})).on("error", notify.onError(function(error) {
            return "Message to the notifier: " + error.message;
        }))
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('pug', function() {
    return gulp.src('app/pug/pages/*.pug')
        .pipe(plumber())
        .pipe(pug({
            pretty: true
        }))
        .on("error", notify.onError(function(error) {
            return "Message to the notifier: " + error.message;
        }))
        .pipe(gulp.dest('app'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        },
    notify: false
    });
});

gulp.task('scripts', function() {
    return gulp.src([
        ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('cleansprite', function() {
    return del.sync('app/img/sprite/sprite.png');
});

gulp.task('spritemade', function() {
    var spriteData =
        gulp.src('app/img/sprite/*.*')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.sass',
            padding: 15,
            cssFormat: 'sass',
            algorithm: 'binary-tree', 
            //  algorithm: top-down left-right diagonal alt-diagonal binary-tree
            cssTemplate: 'handlebarsInheritance.sass.handlebars',
            cssVarMap: function(sprite) {
                sprite.name = 's-' + sprite.name;
            }
        }));

    spriteData.img.pipe(gulp.dest('app/img/sprite/'));
    spriteData.css.pipe(gulp.dest('app/sass/'));
});
gulp.task('sprite', ['cleansprite', 'spritemade']);

gulp.task('coommon-scripts', function() {
    return gulp.src([
        'app/js/common.js'
        ])
        .pipe(plumber())
        .pipe(concat('common.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'));
});

gulp.task('css-libs', ['sass'], function() {
    return gulp.src('app/css/libs.css')
        .pipe(plumber())
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/css'));
});

gulp.task('css-main', ['sass'], function() {
    return gulp.src('app/css/main.css')
        .pipe(plumber())
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/css'));
});

gulp.task('watch', ['browser-sync', 'css-libs', 'css-main', 'scripts'], function() {
    gulp.watch('app/sass/**/*.sass', ['sass']);
    gulp.watch('app/sass/**/*.sass', browserSync.reload);
    gulp.watch('app/pug/**/*.pug', ['pug']);
    // gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('clean', function() {
    return del.sync('dist'); 
});

gulp.task('img', function() {
    return gulp.src('app/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('build', ['clean', 'img', 'sass', 'coommon-scripts', 'scripts'], function() {

    var buildCss = gulp.src([
        'app/css/main.css',
        'app/css/libs.css',
        'app/css/libs.min.css',
        'app/css/main.min.css'
        ])
    .pipe(gulp.dest('dist/css'))

    var buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))

    var buildJs = gulp.src('app/js/**/*')
    .pipe(gulp.dest('dist/js'))

    var buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));

    var buildImg = gulp.src('app/img/sprite/sprite.png')
    .pipe(imagemin({
        progressive: true,
        use: [pngquant()]
    }))
    .pipe(gulp.dest('dist/img/sprite/'));

});

gulp.task('clear', function () {
    return cache.clearAll();
})

gulp.task('default', ['watch']);