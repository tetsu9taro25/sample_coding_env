/*jslint node: true */

/**
 * Plugins
 */
var gulp = require('gulp')
  , path = require('path')
  , rename = require('gulp-rename')
  , concat = require('gulp-concat')
  , uglify = require('gulp-uglify')
  , jshint = require('gulp-jshint')
  , stylish = require('jshint-stylish')
  , sass = require('gulp-sass')
  //, slim = require('gulp-slim')
  , haml = require('gulp-haml')
  , coffee = require('gulp-coffee')
  , prefix = require('gulp-autoprefixer')
  , csslint = require('gulp-csslint')
  , htmlhint = require('gulp-htmlhint')
  , plumber = require('gulp-plumber')
  , notify = require('gulp-notify');

/**
 * Paths
 */
var paths = {
  scripts: [
    'htdocs/**/_*.js'
  ],
  jshint: [
    'gulpfile.js',
    'htdocs/**/*.js',
    '!htdocs/**/all.min.js',
    '!htdocs/**/vendor/**/*.js'
  ],
  styles: [
    'htdocs/**/*.scss',
    '!htdocs/**/_*.scss'
  ],
  htmlhint: [
    'htdocs/**/*.html'
  ],
//  slim: [
//    'htdocs/**/*.slim',
//    '!htdocs/**/includes/*.slim'
//  ],
  haml: [
    'htdocs/**/*.haml',
    '!htdocs/**/includes/*.haml'
  ],
  watch: {
    styles: [
      'htdocs/**/*.scss'
    ],
//    slim: [
//      'htdocs/**/*.slim'
//    ]
    haml: [
      'htdocs/**/*.haml'
    ],
  }
};

/**
 * Options
 */
var options = {
  scripts: {
    uglify: {
      preserveComments: 'some',
      outSourceMap: false
    }
  },
  styles: {
    sass: {
      paths: ['/htdocs/**/scss']
    },
    prefix: ['> 1%', 'last 2 version', 'safari 5', 'ie 8', 'ie 9', 'ios 6', 'android 4']
  }
};

/**
 * Concatenate and minify scripts.
 */
gulp.task('scripts', function() {
  gulp
    .src(paths.scripts)
    .pipe(plumber())
    .pipe(concat('all.min.js'))
    .pipe(uglify(options.scripts.uglify))
    .pipe(gulp.dest('htdocs/common/js/'));
});

/**
 * jshint
 */
gulp.task('jshint', function() {
  gulp
    .src(paths.jshint)
    .pipe(plumber())
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'))
    .on('error', notify.onError("<%= error.message %>"));
});

/**
 * Compile scss and csslint.
 */
gulp.task('styles', function() {
  gulp
    .src(paths.styles)
    .pipe(plumber({errorHandler: notify.onError("<%= error.message %>")}))
    .pipe(sass(options.styles.sass))
    .pipe(prefix(options.styles.prefix))
    .pipe(rename(function(data) {
      data.dirname = path.join(data.dirname, '..', 'css');
    }))
    .pipe(gulp.dest('htdocs/'))
    .pipe(csslint('.csslintrc'))
    .pipe(csslint.formatter())
    .pipe(csslint.formatter('fail'));
});

/**
 * htmlhint
 */
gulp.task('htmlhint', function() {
  gulp
    .src(paths.htmlhint)
    .pipe(plumber())
    .pipe(htmlhint('.htmlhintrc'))
    .pipe(htmlhint.reporter())
    .pipe(htmlhint.failReporter())
    .on('error', notify.onError());
});

///**
// * Compile slim
// */
//gulp.task('slim', function() {
//  gulp
//    .src(paths.slim)
//    .pipe(plumber())
//    .pipe(slim({
//      pretty: true,
//      require: 'slim/include',
//      options: 'include_dirs=["htdocs/includes"]'
//    }))
//    .pipe(gulp.dest('htdocs/detailpage'))
//    .pipe(htmlhint('.htmlhintrc'))
//    .pipe(htmlhint.failReporter())
//    .on('error', notify.onError());
//});

/**
 * Task dependencies.
 */
gulp.task('all', ['scripts',
          'jshint',
          'styles',
          //'slim',
          'haml',
          'htmlhint']);

/**
 * Watch.
 */
gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.jshint, ['jshint']);
  gulp.watch(paths.watch.styles, ['styles']);
  gulp.watch(paths.htmlhint, ['htmlhint']);
  //gulp.watch(paths.watch.slim,['slim']);
  gulp.watch(paths.watch.haml,['haml']);
});

/**
 * Default task.
 */
gulp.task('default', ['watch']);
