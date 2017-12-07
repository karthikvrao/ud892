var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var eslint = require('gulp-eslint');
var browserSync = require('browser-sync').create();
var jasmine = require('gulp-jasmine-phantom');
var concat =  require('gulp-concat');
var babel = require('gulp-babel');
var imagemin = require('imagemin');
var pngquant = require('imagemin-pngquant');
var sourcemaps = require('gulp-sourcemaps');


gulp.task('default', function() {
	gulp.watch('sass/**/*.scss', ['styles', 'lint', 'scripts']);
    gulp.watch('js/**/*.js', ['lint']);
});

gulp.task('lint', function() {
    // ESLint ignores files with "node_modules" paths. 
    // So, it's best to have gulp ignore the directory as well. 
    // Also, Be sure to return the stream from the task; 
    // Otherwise, the task may end before the stream has finished. 
    return gulp.src(['**/*.js','!node_modules/**'])
        // eslint() attaches the lint output to the "eslint" property 
        // of the file object so it can be used by other modules. 
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console. 
        // Alternatively use eslint.formatEach() (see Docs). 
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on 
        // lint error, return the stream and pipe to failAfterError last. 
        .pipe(eslint.failAfterError());
});

gulp.task('crunch-images', function() {
    return gulp.src('src/images/*')
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/images'));
});
 
gulp.task('tests', function() {
  return gulp.src('tests/spec/extraSpec.js')
          .pipe(jasmine({
            integration: true,
            vendor: 'js/**/*.js'
          }));
});

gulp.task('scripts', function() {
    return gulp.src('js/**/*.js')
            .pipe(babel())
            .pipe(concat('all.js'))
            .pipe(gulp.dest('dist/js'));
}

gulp.task('scripts-dist', function() {
    return gulp.src('js/**/*.js')
            .pipe(sourcemaps.init())
            .pipe(babel())
            .pipe(concat('all.js'))
            .pipe(uglify())             // only for production version
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('dist/js'));
}

gulp.task('styles', function() {
	gulp.src('sass/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest('./css'))
        .pipe(browserSync.stream({match: '**/*.css'}));
});

browserSync.init({
    injectChanges: true,
    server: "./"
});
browserSync.watch("*.html").on("change", browserSync.reload);
