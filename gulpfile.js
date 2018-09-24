var gulp            = require('gulp'),
  gulpif          = require('gulp-if'),
  yargs           = require('yargs'),
  autoprefixer    = require('gulp-autoprefixer'),
  sass            = require('gulp-sass'),
  imagemin        = require('gulp-imagemin'),
  watch           = require('gulp-watch'),
  twig            = require('gulp-twig'),
  runSequence     = require('run-sequence'),
  sourcemaps      = require('gulp-sourcemaps'),
  browserSync     = require('browser-sync').create(),
  concat          = require('gulp-concat'),
  csscomb         = require('gulp-csscomb'),
  cssnano         = require('gulp-cssnano'),
  rename          = require('gulp-rename'),
  uglify          = require('gulp-uglify'),
  del             = require('del');

// SETUP
// ---------------------------------------------------------------------
const PRODUCTION = !!(yargs.argv.production);

// Set sass include paths
var sassIncludePaths = [
  'src/assets/scss/includes'
];

var autoprefixerOptions = {
  browsers: ['last 2 versions'],
  cascade: false
};

// Set source paths
var src = {
  path: 'src/',
  assetsDir: 'src/assets/',
  scripts: 'src/assets/js/**/*.js',
  images: 'src/assets/images/**/*',
  sass: 'src/assets/scss/**/*.scss',
  css: 'src/assets/css/**/*.css',
  fonts: 'src/assets/fonts/**/*',
  templates: 'src/templates/*.html',
  templatesAndIncludes: 'src/templates/**/*.html'
};

// Set distribution paths
var dist = {
  path: 'public_html',
  htmlDir: 'public_html',
  assetsDir: 'public_html/assets',
  scriptsDir: 'public_html/assets/js',
  imagesDir: 'public_html/assets/images',
  fontsDir: 'public_html/assets/fonts',
  cssDir: 'public_html/assets/css',
  templates: 'public_html/*.html'
};

//'templates',
// Task runners
gulp.task('build', function(cb) {
  runSequence(['clean', 'sass', 'scripts', 'images', 'vendors', 'templates'], 'copy-assets', cb);
});

gulp.task('default', function(cb) {
  runSequence('build', 'serve', 'watch', cb);
});

// TASKS
// ---------------------------------------------------------------------

//assets
gulp.task('assets-vendors', function() {
  //assets for plugins
  return gulp.src([
  ])
    .pipe(gulp.dest(dist.cssDir));
});

gulp.task('style-vendors', function() {
  return gulp.src([
  ])
  .pipe(concat('vendors.css'))
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest(dist.cssDir));
});

gulp.task('script-vendors', function(done) {
  return gulp.src([
  ])
    .pipe(concat('vendors.js'))
      .pipe(uglify())
      .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(dist.scriptsDir));
});

// Copy fonts
gulp.task('copy-assets', function(){
  return gulp.src(src.fonts)
    .pipe(gulp.dest(dist.fontsDir));
});

//Compile JS
gulp.task('scripts', function() {
  return gulp.src([
    src.assetsDir + 'js/main.js',
  ])
    .pipe(concat('main.js'))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    // .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
    .pipe(gulp.dest(dist.scriptsDir))
    .pipe(browserSync.stream());
});

//Compile Sass into css and auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src(src.sass)
    .pipe(sourcemaps.init())
    .pipe(sass(
    {
      includePaths: sassIncludePaths,
      outputStyle: 'expanded',
      errLogToConsole: true
    })
    .on('error', sass.logError))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(csscomb())
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    // .pipe(gulpif(!PRODUCTION, sourcemaps.write('.')))
    .pipe(gulp.dest(dist.cssDir))
    .pipe(browserSync.stream());
});

//Optimize Images
gulp.task('images', function() {
  return gulp.src(src.images)
    .pipe(imagemin({
      interlaced: true,
      progressive: true,
      svgoPlugins: [{removeViewBox: false}]
    }))
    .pipe(gulp.dest(dist.imagesDir));
});

//Compile HTML Templates
gulp.task('templates', function() {
  return gulp.src(src.templates)
    .pipe(twig())
    .pipe(gulp.dest(dist.htmlDir))
    .pipe(browserSync.stream());
});

gulp.task('serve', function() {
  browserSync.init({
    proxy: 'localhost:' + (process.env.PORT || 5000),
    reloadOnRestart: true,
    reloadDelay: 100,
    open: false,
    notify: false
  });
});

// Watch files and run tasks
gulp.task('watch', function() {
  gulp.watch(src.sass, ['sass']);
  gulp.watch(src.images, ['images']);
  gulp.watch(src.scripts, ['scripts']);
  gulp.watch(src.templatesAndIncludes, ['templates']);
});

gulp.task('clean', function() {
  return del.sync([dist.imagesDir, dist.fontsDir]);
});

gulp.task('vendors', function() {
  return gulp.start('assets-vendors', 'style-vendors', 'script-vendors');
});
