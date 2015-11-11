var gulp = require('gulp')
    , sourcemaps = require('gulp-sourcemaps')
    , jade = require('gulp-jade')
    , babel = require('gulp-babel')
    , stylus = require('gulp-stylus')
    , imagemin = require('gulp-imagemin')
    , plumber = require('gulp-plumber')
    , del = require('del')
    , pngquant = require('imagemin-pngquant')
    , svgo = require('imagemin-svgo')
    , order = require("gulp-order")
    , cssnext = require('gulp-cssnext')
    , postcss = require('gulp-postcss')
    , custom = require('postcss-custom-properties')
    , nested = require('postcss-nested')
    , color = require('postcss-color-function')
    , vars = require('postcss-simple-vars')
    , mixin = require('postcss-mixins')
    , imprt = require('postcss-import')
    , autoprefixer = require('autoprefixer-core')
    , concat = require('gulp-concat')
    , find = require('find')
    , path = require('path')
    , gulpif = require('gulp-if')
    , rename = require("gulp-rename")
    , serve = require('gulp-serve')
    , svg2png = require('gulp-svg2png')
    , iconfont = require('gulp-iconfont')
    , build = require('gulp-gh-pages')
    , uglify = require('gulp-uglify')
    , font_magic = require('postcss-font-magician')
    , cssnano = require('cssnano')
    , bem = require('postcss-bem')
    , css2modernizr = require('css2modernizr')
    , dirs = {
      'source': {
        'jade': ['./source/elements/**/*.jade','./source/pages/*.jade','./source/partials/*.jade']
        , 'page': './source/pages/*.jade'
        , 'list': './source/list/index.jade'
        , 'copy': './source/copy/**/*'
        , 'js': ['./source/elements/**/*.js', './source/js/*.js']
        , 'css': ['./source/elements/**/*.css', './source/css/**/*.css']
        , 'svg': './source/images/**/*.svg'
        , 'images': './source/images/**/*'
        , 'fonts': './source/fonts/**/*'
        , 'icofont': './source/svg-font/**/*.svg'
      }
      , 'build': {
        'html': './build/'
        , 'fonts': './build/fonts/'
        , 'js': './build/js/'
        , 'css': './build/css/'
        , 'images': './build/images/'
        , 'svg': './build/images/'
      }
    };

gulp.task('iconfont', function(){
  return gulp.src(dirs.source.icofont)
    .pipe(plumber())
    .pipe(iconfont({
      fontName: 'icons',
      appendCodepoints: true,
      appendUnicode: true,
      normalize: true,
      centerHorizontally: true
    }))
    .on('glyphs', function(glyphs, options) {
        console.log(glyphs, options);
      })
    .pipe(gulp.dest(dirs.build.fonts));
});

gulp.task('list', function () {
  find.file(/\.html$/, dirs.build.html, function (files){
    var names = []
        , file;
    for(var i=0; i<files.length; i++){
      file = files[i];
      if(file.indexOf('index.html')>-1 || (file.match(/\//g) || []).length>1){
        continue;
      }
      names.push(path.basename(file))
    }
    gulp.src(dirs.source.list)
      .pipe(plumber())
      .pipe(jade({
        pretty: true
        , locals: {'pages': names}
        }))
      .pipe(gulp.dest(dirs.build.html));
  });
});

gulp.task('copy', function () {
  gulp.src(dirs.source.copy).pipe(gulp.dest(dirs.build.html));
});

gulp.task('fonts', function () {
  gulp.src(dirs.source.fonts).pipe(gulp.dest(dirs.build.fonts));
});

gulp.task('images', ['svg'], function () {
  return gulp.src(dirs.source.images)
    .pipe(plumber())
    .pipe(gulpif(/[.](png|jpeg|jpg|svg)$/, imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        optimizationLevel: 1,
        use: [pngquant()]
      })
    ))
    .pipe(gulp.dest(dirs.build.images));
});

gulp.task('svg', function () {
  gulp.src(dirs.source.svg).pipe(gulp.dest(dirs.build.images));
});

gulp.task('html', function() {
  return gulp.src(dirs.source.page)
    .pipe(plumber())
    .pipe(jade({pretty: true}))
    .pipe(gulp.dest(dirs.build.html));
});

gulp.task('js', function() {
  return gulp.src(dirs.source.js)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat("scripts.js"))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dirs.build.js));
});

gulp.task('css', function() {
  var processors = [
    imprt({
      from: process.cwd()+'/source/elements/layout/layout.css'
      , glob: true
      })
    , mixin
    , vars
    , bem({
        defaultNamespace: undefined,
        style: 'bem',
        separators: {
            descendent: '__'
        }})
    , bem({
        defaultNamespace: undefined,
        style: 'bem',
        separators: {
            descendent: '__'
        }})
    , nested
    , color
    , autoprefixer({
        browsers: ['last 2 version', 'IE 8', 'IE 9', 'IE 10', 'IE 11', 'Opera 12']
        })
    // , font_magic({
    //     hosted: process.cwd()+'/build/fonts'
    //     })
    // , cssnano({
    //     discardComments: true
    //     , discardDuplicates: true
    //     , discardEmpty: true
    //     , autoprefixer: false
    //     , mergeLonghand: true
    //     , minifySelectors: true
    //     })
    ];

  return gulp.src(dirs.source.css)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(order(['reset.css', 'fonts.css']))
    .pipe(postcss(processors))
    .pipe(concat("styles.css"))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dirs.build.css));
});

gulp.task('build', function () {
  console.log('deploying');
  return gulp.src('build/**')
    .pipe(plumber())
    .pipe(build({
      branch:     'gh-pages',
      cacheDir:   'gh-cache',
      remoteUrl:  'git@github.com:SilentImp/3waytalk-landing.git'
    }).on('error', function(){
      console.log('error', arguments);
    }));
});

gulp.task('watch', function () {
  gulp.watch([dirs.source.css], ['css']);
  gulp.watch(dirs.source.jade, ['html']);
  gulp.watch(dirs.source.js, ['js']);
});

gulp.task('default', ['copy', 'fonts', 'iconfont', 'html', 'css', 'js', 'images']);


gulp.task('serve', serve('build'));

gulp.task('sw', ['watch', 'serve']);
