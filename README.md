# mallConsoleApp
商城管理js前端 front-end<br/>
脚手架-yeoman生成器 gulp-angular<br/>

<h1>前端组件</h1>
<pre><code>
{
  "name": "mallConsoleApp",
  "version": "0.0.0",
  "dependencies": {
    "angular-animate": "~1.4.0",
    "angular-touch": "~1.4.0",
    "angular-sanitize": "~1.4.0",
    "jquery": "~1.11.3",
    "restangular": "~1.5.1",
    "angular-ui-router": "~0.2.15",
    "bootstrap": "~3.3.4",
    "angular-bootstrap": "~0.13.0",
    "malarkey": "yuanqing/malarkey#~1.3.0",
    "toastr": "~2.1.1",
    "moment": "~2.10.3",
    "animate.css": "~3.3.0",
    "angular": "~1.4.0",
    "ngstorage": "~0.3.7",
    "ng-file-upload": "~5.0.9",
    "angular-ui-tree": "~2.6",
    "angular-ui-sortable": "~0.13.4"
  },
  "devDependencies": {
    "angular-mocks": "~1.4.0"
  },
  "resolutions": {
    "jquery": "~1.11.3",
    "angular": "~1.4.0"
  }
}
</code></pre>

<pre>
切记：因为<code>generator-gulp-angular(v12.1)</code>在编译/构建（build）的过程中，
对ckeditor编入不支持。
因此在编译时，移除根目录下的<code>bower.json</code>配置
 <code>dependencies\ckeditor {version}</code>
 <code>        "ckeditor": "~4.5.1",<code>

 那么在构建的过程中，选择前端依赖js组件时，就会排除掉ckeditor的主文件(同时构建速度大量提高)
 最终生成在<code>dist\scripts的<code>vendor-{version}.js</code>（缺乏ckeditor).
 
 我们在发布项目时，把ckeditor整个文件夹（来源于bower_components，或者官网下载），放入脚本目录中，
 然后在<code>index.html</code>中引入<code>ckeditor.js</code>
 其引入的位置，应在<code>vendor-{version}.js</code>之后，app-{version}之前。
 
 同样的问题也适合,<code>bootstrap\fonts</code>，支援的也不是很好,
 可以参考 <a href='https://github.com/Swiip/generator-gulp-angular/issues/266'>bootstrap font not found #266</a>
 需要修改<code>gulp/build.js</code>或者拷贝<code>fonts</code>目录至<code>dist</code>根目录下 
 
</pre>
