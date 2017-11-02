'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('partials', function () {
  return gulp.src([
    paths.src + '/{app,components}/**/*.html',
    paths.tmp + '/{app,components}/**/*.html'
  ])
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: 'appLooker'
    }))
    .pipe(gulp.dest(paths.tmp + '/partials/'));
});

gulp.task('html', ['inject', 'partials'], function () {
  var partialsInjectFile = gulp.src(paths.tmp + '/partials/templateCacheHtml.js', { read: false });
  var partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: paths.tmp + '/partials',
    addRootSlash: false
  };

  var htmlFilter = $.filter('*.html');
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');
  var assets;

  return gulp.src(paths.tmp + '/serve/*.html')
    .pipe($.inject(partialsInjectFile, partialsInjectOptions))
    .pipe(assets = $.useref.assets())
    .pipe($.rev())
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe($.uglify({preserveComments: $.uglifySaveLicense}))
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.replace('../bootstrap/fonts', 'fonts'))
    .pipe($.replace('bower_components/bootstrap/fonts', 'fonts'))
    .pipe($.csso())
    .pipe(cssFilter.restore())
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(htmlFilter.restore())
    .pipe(gulp.dest(paths.dist + '/'))
    .pipe($.size({ title: paths.dist + '/', showFiles: true }));
});

gulp.task('images', function () {
  return gulp.src(paths.src + '/assets/images/**/*')
    .pipe(gulp.dest(paths.dist + '/assets/images/'));
});

gulp.task('icons', function () {
  return gulp.src(paths.src + '/assets/icons/**/*')
    .pipe(gulp.dest(paths.dist + '/assets/icons/'));
});

gulp.task('audio', function () {
  return gulp.src(paths.src + '/assets/audio/**/*')
    .pipe(gulp.dest(paths.dist + '/assets/audio/'));
});

gulp.task('fonts', function () {
    return gulp.src('bower_components/bootstrap/fonts/*.{eot,svg,ttf,woff,woff2}')
     .pipe(gulp.dest(paths.dist + '/fonts/'));
  // return gulp.src($.mainBowerFiles())
  //   .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
  //   .pipe($.flatten())
  //   .pipe(gulp.dest(paths.dist + '/fonts/'));
});

gulp.task('fontawesome', function () {
    return gulp.src('bower_components/font-awesome/fonts/*.{eot,svg,ttf,woff,woff2}')
     .pipe(gulp.dest(paths.dist + '/fonts/'));
});

gulp.task('misc', function () {
  return gulp.src(paths.src + '/**/*.ico')
    .pipe(gulp.dest(paths.dist + '/'));
});

gulp.task('clean', function (done) {
  $.del([paths.dist + '/', paths.tmp + '/'], done);
});

// Ace plugin
gulp.src([
    'bower_components/ace-builds/src-min/**'
])
    .pipe(gulp.dest(paths.dist + '/bower_components/ace-builds/src-min'));

// Ace Diff plugin
gulp.src([
    'bower_components/ace-diff/dist/ace-diff.min.js',
])
    .pipe(gulp.dest(paths.dist + '/bower_components/ace-diff/dist'));
gulp.src([
    'bower_components/ace-diff/libs/diff_match_patch.js'
])
    .pipe(gulp.dest(paths.dist + '/bower_components/ace-diff/libs'));

// MessengerJS plugin
gulp.src([
    'bower_components/MessengerJs/index.js'
])
    .pipe(gulp.dest(paths.dist + '/bower_components/MessengerJs'));

// Slick fonts plugin
gulp.src([
    'bower_components/slick-carousel/slick/fonts/**'
])
    .pipe(gulp.dest(paths.dist + '/styles/fonts'));

// jqconsole
gulp.src([
    'bower_components/jq-console/jqconsole.min.js'
])
    .pipe(gulp.dest(paths.dist + '/bower_components/jq-console'));
// jsrepl
gulp.src([
    'bower_components/jsrepl/**'
])
    .pipe(gulp.dest(paths.dist + '/bower_components/jsrepl'));
// SEO files
gulp.src([
    'sitemap.txt', 'sogousiteverification.txt', 'BingSiteAuth.xml'
])
    .pipe(gulp.dest(paths.dist));
// static
gulp.src([
    'static/**'
])
    .pipe(gulp.dest(paths.dist));

gulp.task('build', ['html', 'images', 'icons', 'audio', 'fonts', 'fontawesome', 'misc']);
