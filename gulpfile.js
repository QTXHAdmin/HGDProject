// 以下代码会执行在node环境下
const gulp = require('gulp'); // 引入gulp
const sass = require('gulp-sass'); // 需要先安装gulp-sass
const concat = require('gulp-concat'); // 把css和scss文件合并需要用到这个
const autoprefixer = require('gulp-autoprefixer'); // 添加前缀的模块
const cleanCss = require('gulp-clean-css'); // 压缩css
const sourcemap = require('gulp-sourcemaps'); // 找到某些样式的具体的文件
const rev = require('gulp-rev'); // 打版本号
const imagemin = require('gulp-imagemin'); // 对图片进行压缩
const babel = require('gulp-babel'); // babel转换(转换es6 es7..使低版本浏览器能够使用)
const eslint = require('gulp-eslint'); // 校验代码格式
const uglify = require('gulp-uglify'); // js压缩
const revCollector = require('gulp-rev-collector'); // 文件名替换
const htmlmin = require('gulp-htmlmin'); // html压缩
const runSequence = require('run-sequence'); // 按顺序执行gulp任务
const clean = require('gulp-clean'); // 打包之前的清理工作
const connect = require('gulp-connect'); // 配置服务器
const open = require('gulp-open'); // 启动浏览器打开地址
const modRewrite = require('connect-modrewrite'); // 服务器的代理插件
const configRevReplace = require('gulp-requirejs-rev-replace');//给js文件替换文件路径
const tmodjs = require('gulp-tmod');//模板
const replace = require('gulp-replace');//
  // #region
  // gulp.task('html', function () {
  //   console.log('html 压缩');
  // });
  // //创建gulp任务,gulp.series：按照顺序执行,gulp.paralle：可以并行计算
  // //回调函数的返回值3种：stream  promise 调用cb
  // gulp.task('default', gulp.parallel('html', function () {
  //   console.log('gulp default task');
  // }));
  // 以上是练习gulp的api
  // #endregion
  // 以下是实际项目应用
  /**
   * 1.scss文件进行编译，css文件
   * 2.css文件和scss编译后的代码合并到main.css文件中去
   * 3.css自动添加前缀
   * 4.css进行压缩
   * 5.如果是开发阶段，需要增加sourcemap(在调试的时候想看到实际的样式代码是在哪个文件当中的)
   * 6.给最后的main.css文件添加版本号
   */
  // 编译scss文件
  // style:dev是在开发阶段执行的任务
  gulp.task('style:dev', function () {
    return gulp.src(['./src/style/**/*.{css,scss}', '!./src/style/main.css']) // 在style的根目录找css和scss文件
      .pipe(sourcemap.init()) // 找到样式的初始文件位置
      .pipe(sass().on('error', sass.logError)) // 对请求的流中的scss代码进行编译成css代码
      .pipe(autoprefixer({
        // 兼容css3
        browsers: ['last 2 versions'], // 浏览器版本
        cascade: true, // 美化属性，默认true,css文件大括号放的地方
        add: true, // 是否添加前缀，默认true
        remove: true, // 删除过时前缀，默认true
        flexbox: true // 为flexbox属性添加前缀，默认true
      }))
      .pipe(concat('main.css')) // css文件合并
      .pipe(sourcemap.write())
      .pipe(gulp.dest('./src/style'));
  });
// style上线执行的任务(最终部署产品用的)
gulp.task('style', function () {
  return gulp.src(['./src/style/**/*.{css,scss}', '!./src/style/main.css']) // 在style的根目录找css和scss文件
    .pipe(sass().on('error', sass.logError)) // 对请求的流中的scss代码进行编译成css代码
    .pipe(autoprefixer({
      // 兼容css3
      browsers: ['last 2 versions'], // 浏览器版本
      cascade: true, // 美化属性，默认true,css文件大括号放的地方
      add: true, // 是否添加前缀，默认true
      remove: true, // 删除过时前缀，默认true
      flexbox: true // 为flexbox属性添加前缀，默认true
    }))
    .pipe(concat('main.css')) // css文件合并
    .pipe(cleanCss({
      // 压缩css
      compatibility: 'ie8',
      // 保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
      keepSpecialComments: '*'
    }))
    .pipe(rev())
    .pipe(gulp.dest('./dist/style'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('src/style'));
});
// 把assets目录种的所有文件拷贝到dist目录(拷贝任务)
gulp.task('copyAssets', function () { // src方法：把匹配的文件读取到内存流里面去，返回一个流，然后pipe到另外一个流
  return gulp.src(['./src/assets/**/*.*','./src/lib/**','./src/*.ico'], {
      read: true,
      base:'./src'//和dist文件夹一一对应
    }) // 参数也可以是一个数组，找多个文件夹  **代表下面的子 孙子...所有的文件   *.*代表不同文件名不同后缀名，也就是assets下面的所有的文件
    .pipe(gulp.dest('./dist/')); // dest方法把上面的路径下面的文件都保存到这个目录下面去
});
// 图片压缩
gulp.task('imagemin', function () {
  return gulp.src('src/assets/**/*.{jpg,png,gif,jpeg,ico}')
    .pipe(imagemin({
      optimizationLevel: 5, // 类型：Number  默认：3  取值范围：0-7（优化等级）
      progressive: true, // 类型：Boolean 默认：false 无损压缩jpg图片
      interlaced: true,
      // 类型：Boolean 默认：false 隔行扫描gif进行渲染
      multipass: true // 类型：Boolean
      // 默认：false 多次优化svg直到完全优化
    }))
    .pipe(gulp.dest('dist/assets/'));
});
// js处理
gulp.task('js', function () {
  // 1.对es6进行代码的转换
  // 2.eslint js代码进行格式化的校验，保证代码的一致性（比如多个人开发，解决每个人的缩进不同）口头约束每个人并不一定能完全按照规范，所以采取强制性的措施
  // eslint提供了一系列的校验规则，强迫我们代码必须满足这些规则
  // 3.js进行压缩
  // 4.js进行打版本号(dist目录中才需要)
  return gulp.src(['src/js/**/*.js'])
    .pipe(eslint()) // 进行校验，一定要先进行校验再进行babel转换，必须满足这个校验之后才可以往后执行
    .pipe(eslint.format()) // 把错误消息进行格式化输出
    .pipe(eslint.failAfterError()) // 如果校验失败，结束当前任务，下面的babel转换就不执行了
    .pipe(babel()) // babel 转换代码//npm install --save-dev @babel/core要安装这个，还有看错误信息手动改下版本
    .pipe(uglify()) // 压缩js
    .pipe(rev()) // 打版本号
    .pipe(gulp.dest('dist/js/')) // 保存压缩后的js文件
    .pipe(rev.manifest()) // 生成一个映射文件
    .pipe(gulp.dest('src/js/')); // 把映射文件再保存到这个目录下
});
gulp.task('revjs', function () {
  return gulp.src(['dist/js/**/*.js'])
    .pipe(configRevReplace({
      manifest: gulp.src('src/js/rev-manifest.json')
    }))
    .pipe(gulp.dest('dist/js/'));
});
// html处理
gulp.task('html', function () {
  // 1.把html中的路径替换成打上版本后的文件名(css,js)
  return gulp
    .src(['./src/**/*.json', './src/**/*.html']) // - 读取 rev-manifest.json 文件以及需要进行css名替换的文件
    .pipe(revCollector({
      replaceReved: true
    })) // - 执行html文件内css文件名的替换和js文件名替换
    // 2.html进行压缩处理
    .pipe(htmlmin({ // html压缩
      removeComments: true, // 清除HTML注释
      collapseWhitespace: true, // 压缩HTML
      // collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
      removeEmptyAttributes: true, // 删除所有空格作属性值 <input id="" /> ==> <input />
      removeScriptTypeAttributes: true, // 删除<script>的type="text/javascript"
      removeStyleLinkTypeAttributes: true, // 删除<style>和<link>的type="text/css"
      minifyJS: true, // 压缩页面JS
      minifyCSS: true // 压缩页面CSS
    }))
    .pipe(gulp.dest('./dist/')); // - 替换后的文件输出的目录
});
// 打包之前的清理工作
gulp.task('clean', function () {
  return gulp.src(['dist/js/**', 'dist/style/**'], {
      reak: false
    })
    .pipe(clean({
      force: true
    })); // force:true 强制删除
});
//创建一个任务，把模板生成js文件（相当于把模板进行预编译）
gulp.task('tpl',function(){
  return gulp.src('src/template/**/*.html')
  .pipe(tmodjs({
    templateBase: 'src/template/',
    runtime: 'tpl.js',
    compress: false
  }))
  //参考bug: https://github.com/aui/tmodjs/issues/112
  .pipe(replace('var String = this.String;','var String = window.String;'))
  .pipe(gulp.dest('src/js/template/'));
});
// 顺序执行任务
gulp.task('dist', function () {
  runSequence('clean', 'tpl','copyAssets', 'imagemin', 'style', 'js', 'html','revjs');
});
// 监控文件变化
gulp.task('dev', ['open'], function () {
  // 监控scss或者css变化，并自动调用style样式生成工作流
  // 监控的时候文件路径不要写'./'，不然不能监控到 添加文件的变化
  gulp.watch(['src/style/css/**', 'src/style/scss/**'], ['style:dev'], function () {
    connect.reload(); // 开发的web服务器重启
  });
  gulp.watch('src/template/**/*.html',['tpl']);//监控src/template下面的html发生变化就执行tpl任务
});
// 配置测试服务器
gulp.task('devServer', function () {
  connect.server({
    root: ['./src'], // 网站根目录
    port: 38900, // 端口
    livereload: true, // 热重载，修改完之后自动加载
    middleware: function (connect, opt) { // 中间件
      return [
        modRewrite([ // 客户端在请求服务端部署的接口的时候可能涉及到端口的跨域，比如端口不相同，ip不相同，最终部署的时候要部署在一个域名下，使用客户端代理解决跨域的问题
          // 设置代理
          // '^/api/(.*)$ http://192.168.0.208:8080/mockjsdata/7/api/$1 [P]'
        ]) // 当访问/api开头的自动跳转到这个地址:http://192.168.0.102:8080/mockjsdata/7/api/admin/login
      ];
    }
  });
});
// 启动浏览器打开地址
gulp.task('open', ['devServer'], function () {
  gulp.src(__filename).pipe(open({
    uri: 'http://localhost:38900/index.html'
  }));
});