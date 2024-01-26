[webpack 指南](https://www.webpackjs.com/guides/installation/)

# 1. 安装

## 1.1 前提条件

Node.js 请使用最新的长期支持版本(LTS)

## 1.2 本地安装

```bash
npm install --save-dev webpack
# 如果使用 webpack 4+ 版本, 还需要安装 CLI
npm i -D webpack-cli
```

对于大多数项目, 建议本地安装. 因为不同项目可能使用的 webpack 版本是不同的. 这样可以按需针对项目进行必要的升级.

通常, webpack 通过运行一个或多个 npm scripts:

```javascript
// package.json
{
    ...
    "scripts": {
        "start": "webpack --config webpack.config.js"
    }
}
```

## 1.3 全局安装

也可以通过 npm 全局安装, 让 webpack 在全局环境下可用:

```bash
npm i -g webpack
```

> 不推荐全局安装 webpack. 这会让项目中的 webpack 锁定到指定版本, 并且在使用不同的 webpack 版本的项目中, 可能会导致构建失败.

## 1.4 最新体验版本

```bash
npm i webpack@beta
npm i webpack/webpack#<tagname/branchname>
```

> 最新版本 v5.0.0-beta.30 (截止到2020/9/17)

# 2. 起步

webpack 用于编译 JavaScript 模块, 和其他打包器对比:

| 特性                                                         | webpack/webpack                                              | jrburke/requirejs                        | substack/node-browserify                 | jspm/jspm-cli                                                | rollup/rollup                            | brunch/brunch            |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ---------------------------------------- | ---------------------------------------- | ------------------------------------------------------------ | ---------------------------------------- | ------------------------ |
| 附加模块按需加载                                             | yes                                                          | yes                                      | no                                       | System.import                                                | no                                       | no                       |
| AMD `define`                                                 | yes                                                          | yes                                      | deamdify                                 | yes                                                          | rollup-plugin-amd                        | yes                      |
| AMD `require`                                                | yes                                                          | yes                                      | no                                       | yes                                                          | no                                       | yes                      |
| AMD `require`按需加载                                        | yes                                                          | 手动配置                                 | no                                       | yes                                                          | no                                       | no                       |
| CommonJS `exports`                                           | yes                                                          | 只包含在 define 中                       | yes                                      | yes                                                          | commonjs-plugin                          | yes                      |
| CommonJS `require`                                           | yes                                                          | 只包含在 define 中                       | yes                                      | yes                                                          | commonjs-plugin                          | yes                      |
| CommonJS `require.resolve`                                   | yes                                                          | no                                       | no                                       | no                                                           | no                                       |                          |
| require 中拼接 `require('./fi' + 'le')`                      | yes                                                          | no♦                                      | no                                       | no                                                           | no                                       |                          |
| 调试支持                                                     | SourceUrl, SourceMaps                                        | 不需要                                   | SourceMaps                               | SourceUrl, SourceMaps                                        | SourceUrl, SourceMaps                    | SourceMaps               |
| 依赖                                                         | 19MB / 127 个程序包                                          | 11MB / 118 个程序包                      | **1.2MB / 1 个程序包**                   | 26MB / 131 个程序包                                          | ?MB / 3 个程序包                         |                          |
| ES2015 `import`/ `export`                                    | yes (webpack 2)                                              | no                                       | no                                       | yes                                                          | yes                                      | yes, 通过 es6 模块转换器 |
| require(guided) 中的表达式 `require('./templates/' + template)` | **yes (包括所有匹配的文件)**                                 | no♦                                      | no                                       | no                                                           | no                                       | no                       |
| require(free) 中的表达式 `require(moduleName)`               | 手动配置                                                     | no♦                                      | no                                       | no                                                           | no                                       |                          |
| 生成单独包                                                   | yes                                                          | yes♦                                     | yes                                      | yes                                                          | yes                                      | yes                      |
| 间接的 require `var r = require; r('./file')`                | yes                                                          | no♦                                      | no                                       | no                                                           | no                                       |                          |
| 分别加载每个文件                                             | no                                                           | yes                                      | no                                       | yes                                                          | no                                       | no                       |
| 损坏的路径名                                                 | yes                                                          | no                                       | 部分                                     | yes                                                          | 不需要 (路径名称不在包中)                | no                       |
| 压缩                                                         | uglify                                                       | uglify, closure compiler                 | uglifyify                                | yes                                                          | uglify-plugin                            | UglifyJS-brunch          |
| 用 common bundle 构建多页                                    | 手动配置                                                     | yes                                      | 手动配置                                 | 使用包算法                                                   | no                                       | no                       |
| 多个 bundle                                                  | yes                                                          | 手动配置                                 | 手动配置                                 | yes                                                          | no                                       | yes                      |
| Node.js 内置 libs `require('path')`                          | yes                                                          | no                                       | yes                                      | yes                                                          | node-resolve-plugin                      |                          |
| Node.js 其他                                                 | process, __dir/filename, global                              | -                                        | process, __dir/filename, global          | process, __dir/filename, global for cjs                      | global (commonjs-plugin)                 |                          |
| 插件                                                         | yes                                                          | yes                                      | yes                                      | yes                                                          | yes                                      | yes                      |
| 预处理                                                       | **loaders, transforms**                                      | loaders                                  | transforms                               | plugin translate                                             | plugin transforms                        | compilers, optimizers    |
| 浏览器替换                                                   | web_modules, .web.js, package.json field, alias config option | alias option                             | package.json field, alias option         | package.json, alias option                                   | no                                       |                          |
| 可 require 文件                                              | 文件系统                                                     | web                                      | 文件系统                                 | 通过插件                                                     | 文件系统或通过插件                       | 文件系统                 |
| 执行时(runtime)开销                                          | **243B + 20B 每个模块 + 4B 每个依赖**                        | 14.7kB + 0B 每个模块 + (3B + X) 每个依赖 | 415B + 25B 每个模块 + (6B + 2X) 每个依赖 | 5.5kB for 自执行 bundle, 38kB 全部 loader 和 polyfill, 0 普通模块, 293B CJS, 139B ES2015 System.register before gzip | none for ES2015 modules (可能有其他格式) |                          |
| 开发文件监听(watch)模式                                      | yes                                                          | 不需要                                   | watchify                                 | 开发不需要                                                   | rollup-watch                             | yes                      |

♦ 在生产模式 ( 在开始模式中相反)

X 是路径字符串的长度

## 2.1 基本安装

project

```diff
  |- package.json
+ |- index.html
+ |- /src
+   |- index.js
```

src/index.js

```javascript
function component() {
  const element = document.createElement('div');

  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  return element;
}

document.body.appendChild(component());
```

index.html

```html
<!DOCTYPE html>
<html>
  <head>
    <title>起步</title>
    <script src="https://unpkg.com/lodash@4.16.6"></script>
  </head>
  <body>
    <script src="./src/index.js"></script>
  </body>
</html>
```

在这个示例中, `<script>`标签之间存在隐式依赖关系, `index.js`要执行必须保证 `lodash`已经被加载并且有一个全局变量 `_`.

使用这种方式去管理 JavaScript 项目会有一些问题:

- 脚本的执行依赖于外部扩展库 (external library).
- 如果依赖不存在, 或者引入顺序错误, 程序将无法正常运行.
- 如果依赖被引入但是并没有使用, 浏览器将被迫下载无用代码.

接下来使用 webpack 来管理这些脚本.

## 2.2 创建一个 bundle 文件

project

```diff
|- package.json
+ |- /dist
+   |- index.html
- |- index.html
  |- /src
    |- index.js
```

要在 `index.js`中打包 `lodash`依赖, 需要本地安装 `lodash`.

```bash
npm i lodash
```

> 安装一个要打包到生产环境的安装包, 应该使用 `npm install --save` 或 `npm i`, 如果安装一个用于开发环境的安装包 (例如: linter, 测试库), 应该使用 `npm install --save-dev`或 `npm i -D`(注意 D 必须大写)

现在, 在 `index.js`中 import `lodash`

```diff
+ import _ from 'lodash';
+
  function component() {
    var element = document.createElement('div');

-   // Lodash, currently included via a script, is required for this line to work
+   // Lodash, now imported by this script
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    return element;
  }

  document.body.appendChild(component());
```

因为现在是通过 `import`引入 `lodash`, 所以将 `lodash`的 `<script>`删除, 然后修改另一个 `<script>`标签它用来加载 bundle, 而不是原始的 /src 下的文件.

```diff
  <!doctype html>
  <html>
   <head>
     <title>起步</title>
-    <script src="https://unpkg.com/lodash@4.16.6"></script>
   </head>
   <body>
-    <script src="./src/index.js"></script>
+    <script src="main.js"></script>
   </body>
  </html>
```

最后使用 npx 运行 webpack. Node 8.2+ 版本提供的 `npx`命令, 可以运行在初始安装的 webpack 包中的二进制文件 (`./node_modules/.bin/webpack`).

```bash
npx webpack
```

## 2.3 模块

ES2015 中的 `import`和 `export`语句已经被标准化. 虽然大多数浏览器还无法支持它们, 但是 webpack 却能提供开箱即用般的支持.

事实上, webpack 会将代码 "转译", 以便旧版本浏览器可以执行. 除了 `import`和 `export`, webpack 还能够支持多种其他模块语法.

注意, webpack 不会更改代码中除 `import`和 `export`语句以上的部分, 如果使用了其它 ES2015 特性, 请确保 webpack 的 loader 系统中使用了一个像是 Babel 或类似的转译器.

## 2.4 使用一个配置文件

在 webpack 4 中, 可以无须任何配置使用, 然而大多数项目会需要很复杂的设置, 这就是为什么 webpack 仍然要支持配置文件.

```diff
  |- package.json
+ |- webpack.config.js
  |- /dist
    |- index.html
  |- /src
    |- index.js
```

```bash
npx webpack
# 或
npx webpack --config webpack.config.js
```

> 如果 `webpack.config.js`文件存在, 则 webpack 命令将默认选择使用它. 当然也可以使用 `--config` 选项指定其他任何名称的配置文件.

比起在终端中手动输入大量命令, 配置文件具有更多的灵活性. 可以通过配置方式指定 loader 规则(loader rules), 插件(plugins), 解析选项(resolve options), 以及许多其他增强功能.

## 2.5 NPM 脚本(NPM Scripts)

考虑到用 CLI 这种方式来运行本地的 webpack 不是特别方便, 我们可以设置一个快捷方式. 在 `package.json`中添加一个 npm 脚本.

package.json

```diff
  {
    "name": "webpack-demo",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
+     "build": "webpack"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "devDependencies": {
      "webpack": "^4.0.1",
      "webpack-cli": "^2.0.9",
      "lodash": "^4.17.5"
    }
  }
```

现在可以运行命令:

```bash
npm run build
```

> 通过向 `npm run build`命令和你的参数之间添加两个中横线, 可以将自定义参数传递给 webpack, 例如: `npm run build -- --colors`

# 3. 管理资源

在 webpack 出现之前, 前端开发人员会使用 grunt 或 gulp 等工具来处理资源, 并将它们从 `/src`文件夹移动到 `/dist`或 `/build`目录中. JavaScript 模块也是同样方式处理的. 但是像 webpack, 它是动态打包(dynamically bundle)所有依赖项(创建所谓的**依赖图(dependency graph)**). 因为每个模块都可以明确表述它自身的依赖, 这样将避免打包未使用的模块.

webpack 最出色的功能之一就是, 除了 JavaScript, 还可以通过 loader 引入任何其他类型的文件. 也就是说, 显式依赖 JavaScript 模块的优点, 同样也可以用来构建网站或 web 应用程序中的所有非 JavaScript 内容. 先从 CSS 开始起步.

## 3.1 加载 CSS

为了从 JavaScript 模块中 `import`一个 CSS 文件, 需要在 module 配置中安装并添加 style-loader 和 css-loader:

```bash
npm i -D style-loader css-loader
```

webpack.config.js

```diff
  const path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
+   module: {
+     rules: [
+       {
+         test: /\.css$/,
+         use: [
+           'style-loader',
+           'css-loader'
+         ]
+       }
+     ]
+   }
  };
```

> webpack 根据正则表达式, 来确定应该查找哪些文件, 并将其提供给指定的 loader. 在这里就是将 `.css`结尾的全部文件, 都提供给 `style-loader`和 `css-loader`

project

```diff
  |- package.json
  |- webpack.config.js
  |- /dist
    |- bundle.js
    |- index.html
  |- /src
+   |- style.css
    |- index.js
  |- /node_modules
```

src/index.js

```javascript
...
import './style.css'
...
```

此时, 依赖的样式 `import './style.css`中的 CSS 字符串将在模块运行时, 被加入到 `<style>`标签, 并被插入到 html 文件的 `<head>`中.

## 3.2 加载图片

使用 file-loader, 可以轻松的将背景和图标等图片内容混合到 CSS 中.

```bash
npm i -D file-loader
```

webpack.config.js

```diff
...
module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ]
        },
+       {
+         test: /\.(png|svg|jpg|gif)$/,
+         use: [
+           'file-loader'
+         ]
+       }
      ]
    }
```

project

```diff
  |- package.json
  |- webpack.config.js
  |- /dist
    |- bundle.js
    |- index.html
  |- /src
+   |- icon.svg
    |- style.css
    |- index.js
  |- /node_modules
```

现在, 当使用 `import Icon from './icon.svg'`, 该图像将被处理并添加到指定的 `output`目录, 并且 `Icon`变量将包含该图像处理后的最终 url. 当使用 css-loader时, 在 CSS 中的 `url('./icon.svg')`会使用类似的过程去处理. loader 会识别这是一个本地文件, 并将 `'./icon.svg'`路径, 替换为处理后的最终路径. html-loader 会以相同的方式处理 `<img src="./icon.svg" />`

webpack 运行后会发现, img 和 背景图片指向的都是类似 `dabc8b293a64eba5a5ab0dabb31511eb.svg`一样的路径. 这意味着 webpack 在 `src`文件夹中找到了图片文件, 并成功处理了它.

> 下一步可以查看 image-webpack-loader 和 url-loader, 以了解更多关于图片压缩和优化功能.

## 3.3 加载字体

file-loader 和 url-loader 可以接收并加载任何文件, 然后将其输出到构建目录中. 这就是说, 可以将它们用于任何类型的文件, 包括**字体**. 

webpack.config.js

```diff
+       {
+         test: /\.(woff|woff2|eot|ttf|otf)$/,
+         use: [
+           'file-loader'
+         ]
+       }
```

project

```diff
  |- package.json
  |- webpack.config.js
  |- /dist
    |- bundle.js
    |- index.html
  |- /src
+   |- gigi.ttf
    |- icon.svg
    |- style.css
    |- index.js
  |- /node_modules
```

此时就可以使用 `@font-face`引入字体, 本地的 `url(...)`指令会被 webpack 处理, 就像处理图片资源一样:

src/style.css

```css
@font-face {
  font-family: 'MyFont';
  src: url('./gigi.ttf');
  font-weight: 300;
  font-style: normal;
}
```

## 3.4 加载数据

此外, 可以加载的有用资源还包括数据. 如 JSON 文件, CSV, TSV 和 XML等. 类似于 NodeJS, JSON 支持实际上是内置的. 也就是说 `import Data from './data.json'`默认将正常运行. 要导入 CSV, TSV 和 XML, 可以使用 csv-loader 和 xml-loader.

```bash
npm i -D csv-loader xml-loader
```

project

```diff
  |- /src
+   |- data.xml
+   |- data.csv
```

现在, 可以直接使用 `import`加载四种类型的数据(JSON, CSV, TSV, XML)中的任何一种, 导入的数据将会是一个直接可以使用的已经解析的 JSON.

## 3.5 全局资源

以上述方式加载资源的好处是, 你可以以直观的方式将模块和资源组合在一起. 无需依赖于含有全部资源的 `/assets`目录, 而是将资源与代码组合在了一起.

```diff
- |- /assets
+ |– /components
+ |  |– /my-component
+ |  |  |– index.jsx
+ |  |  |– index.css
+ |  |  |– icon.svg
+ |  |  |– img.png
```

这种配置方式会使代码更具备可移植性. 因为现有的统一放置的方式会造成所有资源紧密耦合在了一起. 如果想在另一个项目中使用 `/my-component`, 只需要将整个文件夹复制过去. 在确保安装了任何扩展依赖(external dependencies), 并且已经在配置中定义过相同的 loader, 那么项目应该能够良好运行.

但是, 如果你无法使用新的开发方式, 只能固定于旧有的开发方式. 或者有一些多个组件之间共享的资源. 你仍然可以将这些资源存储在公共目录(base directory)中, 甚至配合使用 alias 来使它们更方便 `import 导入`.

# 4. 管理输出

目前为止, 我们在 `index.html`文件中手动引入所有资源, 然而随着应用程序的增长, 并且一旦开始对文件名使用 hash 并输出多个 bundle时, 手动对 `index.html`文件进行管理将会变得困难起来. 此时可以通过一些插件使这个过程更容易操控.

## 4.1 设定 HtmlWebpackPlugin

首先安装插件:

```bash
npm i -D html-webpack-plugin
```

调整 webpack.config.js:

```diff
  const path = require('path');
+ const HtmlWebpackPlugin = require('html-webpack-plugin');

  module.exports = {
    entry: {
      app: './src/index.js',
      print: './src/print.js'
    },
+   plugins: [
+     new HtmlWebpackPlugin({
+       title: 'Output Management'
+     })
+   ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```

之时再使用 webpack 构建, `dist/index.html`将会被 `HtmlWebpackPlugin`生成的 `index.html`文件覆盖. 所有的 bundle 会自动添加到插件生成的新的 html中.

## 4.2 清理 `/dist`文件夹

`/dist`文件夹会随着时间的推移变的相当杂乱, 通常在每次构建前都会先清理 `/dist`文件夹, 这是比较推荐的做法. clean-webpack-plugin 是一个比较普及的管理插件.

```bash
npm i -D clean-webpack-plugin
```

webpack.config.js

```diff
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
+ const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;

  module.exports = {
    entry: {
      app: './src/index.js',
      print: './src/print.js'
    },
    plugins: [
+     new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: 'Output Management'
      })
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```

## 4.3 Manifest

webpack 及其插件是通过 manifest 来对 「你的模块映射到输出 bundle 的过程」保持追踪的.

通过使用 WebpackManifestPlugin 可以直接将数据提到到一个 json 文件, 以供使用.

```bash
npm i -D webpack-manifest-plugin
```

# 5. 开发

> 这一节使用的工具仅限用于开发环境, **不要**在生产环境中使用它们.

## 5.1 使用 source map

在 webpack 打包源代码时, 可能会很难追踪到错误和警告在源代码中的原始位置. 例如: 如果将三个源文件(`a.js`, `b.js`和 `c.js`)打包到一个 bundle (`bundle.js`)中, 而其中一个源文件包含一个错误, 那么堆栈跟踪就会简单地指向到 `bundle.js`. 这通常并没有太多帮助, 因为你可能需要准确地知道错误来自于哪个源文件.

为了更容易地追踪错误和警告, JavaScript 提供了 source map 功能, 将编译后的代码映射回原始源代码. 如果一个错误来自于 `b.js`, source map 就会明确的告诉你.

source map 有很多不同的选项可用.

开发环境中我们使用 `inline-source-map`选项.

webpack.config.js

```diff
+   devtool: 'inline-source-map',
```

src/print.js

```diff
  export default function printMe() {
-   console.log('I get called from print.js!');
+   cosnole.error('I get called from print.js!');
  }
```

此时在最终生成的页面中, 点击按钮, 控制台中的错误将包含发生错误的文件(`print.js`)和行号(2)信息.

## 5.2 选择一个开发工具

> 一些文本编辑器具有"安全写入"功能, 可能会干扰以下某些工具.

每次要编译代码时, 手动输入命令并运行就会变得很麻烦.

webpack 中有几个不同的选项, 可以在代码发生变化后自动编译代码:

1. webpack's Watch Mode
2. webpack-dev-server
3. webpack-dev-middleware

## 5.3 使用观察模式 (Watch Mode)

你可以指示 webpack "watch" 当目录中有文件被更新时, 代码将重新编译.

```bash
npx webpack --watch
```

此时, 修改项目目录下的文件, webpack 将自动重新编译.

> 目前有二个情况待解决:
>
> 1. clean-webpack-plugin 只在第一次执行时触发, 后续的自动重新编译并不会清理 dist 目录.(这个其实也正常, 在开发过程中并不需要频繁清理)
> 2. html-webpack-plugin 生成的 html, 在后续自动重新编译时被清理了???

这时, 有一个缺点就是如果要查看修改后的效果, 还需要刷新浏览器. 这时候就可以尝试使用 webpack-dev-server, 它会自动刷新浏览器.

## 5.4 使用 webpack-dev-server

webpack-dev-server 提供了一个简单的 web 服务器, 并且能够实时重新加载 (live reloading)

```bash
npm i -D webpack-dev-server
```

修改 webpack.config.js 告诉开始服务器(dev server), 在哪里查找文件.

```diff
+   devServer: {
+     contentBase: './dist'
+   },
```

在命令行中运行:

```bash
npx webpack-dev-server --open
```

此时浏览器会自动加载页面, 如果修改并保存任意源文件, web 服务器就会自动重新加载编译后的代码.

## 5.5 使用 webpack-dev-middleware

`webpack-dev-middleware`是一个容器(wrapper), 它可以把 webpack 处理后的文件传递给一个服务器(server). `webpack-dev-server`在内部使用了它. 同时, 它也可以作为一个单独的包使用, 以便进行更多自定义设置来实现更多需求. 接下来是一个 `webpack-dev-middleware`配合 `express`的示例.

```bash
npm i -D express webpack-dev-middleware
```

webpack.config.js

```diff
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
+     publicPath: '/'
    }
```

增加 publicPath 会在服务器脚本中用到.

server.js

```javascript
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config');
const compiler = webpack(config);

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath, // 这里就是在 webpack.config.js 中指定的publicPath
  })
);

app.listen(3456, () => {
  console.log('Express listening on port 3456!\n');
});

```

最后执行:

```bash
node server.js
```

此时 express 创建的服务器将会输出 webpack 编译后的内容. 此时修改源代码, webpack 也会自动重新编译. 刷新浏览器后就能看到变化.

## 5.6 调整文本编辑器

使用自动编译代码时, 可能会在保存文件时遇到一些问题. 某些编辑器具有"安全写入"功能, 可能会影响重新编译.

- **Sublime Text 3**: 在用户首选项(user preferences)中添加 `atomic_save: "false"`.
- **IntelliJ**: 在首选项(preferences)中使用搜索, 查找到 "safe write"并且禁用它.
- **Vim**: 在设置(settings)中增加 `:set backupcopy=yes`.
- **WebStorm**: 在 `Preferences > Appearance & Behavior > System Settings`中取消选中 Use "safe write".

# 6. 模块热替换

模块热替换(Hot Module Replacement 或 HMR)是 webpack 提供的最有用的功能之一. 它允许在运行时更新各种模块, 而无需进行完全刷新.

> HMR 不适用于生产环境.

## 6.1 启用 HMR

启用此功能实际上相当简单, 就是更新 webpack-dev-server 的配置, 和使用 webpack 内置的 HMR 插件.

> 如果使用了 webpack-dev-middleware, 而没有使用 webpack-dev-server, 请使用 ***webpack-hot-middleware*** package 包, 以在你的自定义服务或应用程序上使用 HMR.

webpack.config.js

```diff
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const CleanWebpackPlugin = require('clean-webpack-plugin');
+ const webpack = require('webpack');

  module.exports = {
    entry: {
-      app: './src/index.js',
-      print: './src/print.js'
+      app: './src/index.js'
    },
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist',
+     hot: true
    },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        title: 'Hot Module Replacement'
      }),
+     new webpack.NamedModulesPlugin(), // 已经废弃
+     new webpack.HotModuleReplacementPlugin()
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```

index.js

```diff
  import _ from 'lodash';
  import printMe from './print.js';

  function component() {
    var element = document.createElement('div');
    var btn = document.createElement('button');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    btn.innerHTML = 'Click me and check the console!';
    btn.onclick = printMe;

    element.appendChild(btn);

    return element;
  }

  document.body.appendChild(component());
+
+ if (module.hot) {
+   module.hot.accept('./print.js', function() {
+     console.log('Accepting the updated printMe module!');
+     printMe();
+   })
+ }
```

运行

```bash
npx webpack-dev-server --open
```

之后, 修改 `print.js` 文件, 将会触发 `index.js`中相关的更新方法(`module.hot.accept(...)`).

## 6.2 通过 Node.js API

当同时使用 webpack dev server 和 Node.js API 时, 不要将 dev server 选项放在 webpack 配置对象(webpack config object)中. 而是, 在创建选项时, 将其作为第二个参数传递.

```javascript
new WebpackDevServer(compiler, options);
```

想要启用 HMR, 还需要修改 webpack 配置对象, 使其包含 HMR 入口起点. `webpack-dev-server`package 中具有一个叫做 `addDevServerEntrypoints`的方法, 可以通过这个方法来实现.

## 6.3 问题

之前模块热替换只是加载了新的代码, 但是点击页面上的按钮, 会发现控制台输出的还是旧的功能. 这是因为按钮的 `onclick`事件仍然绑定在旧的函数上. 为了让它与 HMR 正常工作, 还需要在 `module.hot.accept`中更新绑定到新的函数上.

index.js

```diff
  import _ from 'lodash';
  import printMe from './print.js';

  function component() {
    var element = document.createElement('div');
    var btn = document.createElement('button');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    btn.innerHTML = 'Click me and check the console!';
    btn.onclick = printMe;  // onclick 事件绑定原始的 printMe 函数上

    element.appendChild(btn);

    return element;
  }

- document.body.appendChild(component());
+ let element = component(); // 当 print.js 改变导致页面重新渲染时，重新获取渲染的元素
+ document.body.appendChild(element);

  if (module.hot) {
    module.hot.accept('./print.js', function() {
      console.log('Accepting the updated printMe module!');
-     printMe();
+     document.body.removeChild(element);
+     element = component(); // 重新渲染页面后，component 更新 click 事件处理
+     document.body.appendChild(element);
    })
  }
```

## 6.4 HMR 修改样式表

借助于 `style-loader`的帮助, CSS模块热替换实际上是相当简单的. 当更新 CSS 依赖模块时, 此 loader 会在后台使用 `module.hot.accept`来修补(patch) `<style>`标签.

## 6.5 其他代码和框架

- [React Hot Loader](https://github.com/gaearon/react-hot-loader): 实时调整 react 组件.
- [Vue Loader](https://github.com/vuejs/vue-loader): 此 loader 支持用于 vue 组件的 HMR, 提供开箱即用体验.
- [Elm Hot Loader](https://github.com/fluxxu/elm-hot-loader): 支持用于 Elm 程序语言的 HMR.
- [Redux HMR](https://survivejs.com/webpack/appendices/hmr-with-react/#configuring-hmr-with-redux): ~~无需 loader 或插件, 只需对 main store 文件进行简单的修改.~~(已合并到 React Hot Loader)
- [Angular HMR](https://github.com/PatrickJS/angular-hmr): 没有必要使用 loader! 只需对主要的 NgModule 文件进行简单的修改, 由 HMR API 完全控制.

# 7. tree shaking

*tree shaking* 是一个术语, 通常用于描述移除 JavaScript 上下文中的未引用代码(dead-code). 它依赖于 ES2015 模块系统中的静态结构特性, 例如 import 和 export. 这个术语和概念实际上兴起于 ES2015 模块打包工具 rollup.

新的 webpack 4 正式版本扩展了这个检测能力, 通过 `package.json`的 "sideEffects"属性作为标记, 向 eompiler 提供提示, 表明项目中的哪些文件是 "pure(纯的 ES2015 模块)", 由此可以安全地删除文件中未使用的部分.

## 7.1 添加一个通用模块

```diff
|- package.json
|- webpack.config.js
|- /dist
  |- bundle.js
  |- index.html
|- /src
  |- index.js
+ |- math.js
|- /node_modules
```

## 7.2 将文件标记为无副作用 (side-effect-free)

可以通过 `package.json`的 "sideEffects"属性来指定是否有副作用.

> 副作用的定义是: 在导入时会执行特殊行为的代码, 而不是仅仅暴露一个 export 或多个 export. 举例来说, polyfill 它会影响全局作用域, 并且通常不提供 export.

```json
{
	"name": "your-project",
    "sideEffects": false, // 表示所有代码都不包含副作用, webpack 可以安全地删除未用到的 export 导出.
    "sideEffects": [
        "./src/some-side-effectful-file.js"
    ], // 提供一个数组, 指定某些代码确实有一些副作用.
    // 数组方式支持相关文件的相对路径, 绝对路径和 glob 模式. 它在内部使用 micromatch.
    //...
}
```

> 注意: 任何导入的文件都会受到 tree shaking 的影响. 这意味着, 如果在项目中使用类似 css-loader 并导入 CSS 文件, 则需要将其添加到 side effect 列表中, 以免在生产模式中无意将它删除.

```json
{
    "name": "your-project",
    "sideEffects": [
        "./src/some-side-effectful-file.js",
        "*.css"
    ]
}
```

最后, 还可以在 module.rules 配置选项中设置 "sideEffects".

## 7.3 压缩输出

从 webpack 4 开始, 可以通过 "mode" 配置选项轻松切换到压缩输出, 只需设置为 "production".

webpack.config.js

```diff
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
- }
+ },
+ mode: "production"
};
```

> 注意, 也可以在命令行接口中使用 --optimize-minimize 标记, 来使用 UglifyJSPlugin.

# 8. 生产环境构建

## 8.1 配置

开发环境(development)和生产环境(production)的构建目标差异很大. 在开发环境中, 我们需要具有强大的, 具有实时重新加载(live reloading)或热模块替换(hot module replacement)能力的 source map 和 localhost server. 而在生产环境中, 我们的目标则转向于关注更小的 bundle, 更轻量的 source map, 以及更优化的资源, 以改善加载时间. 由于要遵循逻辑分离, 我们通常建议为每个环境编写彼此独立的 webpack 配置.

虽然, 我们将生产和开发环境做了区分, 但是我们还是会遵循不重复原则(Don't repeat yourself - DRY), 保留一个"通用"配置. 为了将这些配置合并在一起, 我们将使用一个名为 `webpack-merge`的工具. 通过"通用"配置, 我们不必在环境特定(environment-specific)的配置中重复代码.

```bash
npm i -D webpack-merge
```

project

```diff
  |- package.json
- |- webpack.config.js
+ |- webpack.common.js
+ |- webpack.dev.js
+ |- webpack.prod.js
  |- /dist
  |- /src
    |- index.js
    |- math.js
  |- /node_modules
```

## 8.2 NPM Scripts

package.json

```diff
  {
    "name": "development",
    "scripts": {
-     "start": "webpack-dev-server --open",
+     "start": "webpack-dev-server --open --config webpack.dev.js",
-     "build": "webpack"
+     "build": "webpack --config webpack.prod.js"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "devDependencies": {
    	...
    }
  }
```

或直接执行命令:

```bash
npx webpack --config webpack.prod.js
# 或
npx webpack-dev-server --open --config webpack.dev.js
```

## 8.3 Minification

UglifyJsPlugin 已经被移除, 默认是通过配置 `optimization.minimize`来选择是否开启(`mode: 'development'时默认开启压缩和tree shaking`).

代码压缩还有一些可选的插件:

- [terser-webpack-plugin](https://github.com/webpack-contrib/terser-webpack-plugin)
- [closure-webpack-plugin](https://github.com/webpack-contrib/closure-webpack-plugin)

```js
optimization: {
    minimize: true,
    minimizer: [
        new TerserPlugin(),
        // 或
        new ClosurePlugin(),
    ]
}
```

## 8.4 source map

webpack 鼓励在生产环境中启用 srouce map, 因为它们对调试源码(debug)和运行基准测试(benchmark test)很有帮助. 在生产环境建议构建一个快速的推荐配置. 在生产环境中使用 `source-map`, 在开发环境中使用 `inline-source-map`

webpack.prod.js

```diff
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
+  devtool: 'source-map',
   mode: 'production',
});
```

> 避免在生产中使用 `inline-***`和 `eval-***`, 因为它们会增加 bundle 大小, 并降低整体性能.

## 8.5 指定环境

许多 library 通过与 `process.env.NODE_ENV`环境变量关联, 以决定 library 中应该引用哪些内容. 例如, 当不处于生产环境时, 某些 library 为了使调试变得容易, 可能会添加额外的日志记录(log)和测试(test). 当使用 `process.env.NODE_ENV === 'production'`时, 一些 library 可能针对具体用户的环境进行代码优化, 从而删除或添加一些重要的代码. 可以使用 webpack 内置的 DefinePlugin 为所有的依赖定义这个变量.

webpack.prod.js

```diff
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
+ const webpack = require('webpack');

module.exports = merge(common, {
  devtool: 'source-map',
  mode: 'production',
+  plugins: [
+   new webpack.DefinePlugin({
+    'process.env.NODE_ENV': JSON.stringify('production'),
+   }),
+  ],
});

```

> 技术上讲, `NODE_ENV`是一个由 Node.js 暴露给执行脚本的系统环境变量. 通常用于决定在开发环境与生产环境(dev-vs-prod)下, 服务器工具, 构建脚本和客户端 library 的行为. 然而, 与预期不同的是, 无法在构建脚本 `webpack.config.js`中, 将 `process.env.NODE_ENV`设置为 `"production"`. 因此, 如 `process.env.NODE_ENV === 'production' ? '[name].[hash].bundle.js' : '[name].bundle.js'`这样的条件语句, 在 webpack 配置文件中, 无法按照预期运行. (请参考 *17. 使用环境变量*)

## 8.6 Split CSS

正如在管理资源中最后的 "加载 CSS" 小节中提到的, 通常最好的做法是使用 `ExtractTextPlugin`将 CSS 分离成单独的文件. 使用 `disable`选项和 `--env`标记结合使用, 以允许在开发中进行内联加载, 推荐用于热模块替换与构建速度.

## 8.7 CLI 替代选项

以上描述也可以通过命令行实现. 例如, `--optimize-minimize`标记将在后台引用 `UglifyJSPlugin`.使用 `--define process.env.NODE_ENV="'production'"`和使用 `DefinePlugin`会做同样的事情.

# 9. 代码分离

代码分离是 webpack 中最引人注目的特性之一. 此特性能够把代码分离到不同的 bundle 中, 然后可以按需加载或并行加载这些文件. 代码分离可以用于获取更小的 bundle, 以及控制资源加载优先级, 如果使用合理, 会极大影响加载时间.

有三种常用的代码分离方法:

- **入口起点**: 使用 entry 配置手动地分离代码.
- **防止重复**: 使用 CommonsChunkPlugin 去重和分离 chunk.
- **动态导入**: 通过模块的内联函数调用来分离代码.

## 9.1 入口起点(entry points)

这是迄今为止最简单, 最直观的分离代码的方式. 不过, 这种方式手动配置较多, 并有一些陷阱.

project

```diff
|- package.json
|- webpack.config.js
|- /dist
|- /src
  |- index.js
+ |- another-module.js
```

运行 webpack 构建, 将生成二个 bundle, `index.bundle.js`和 `another.bundle.js`, 但这种方法存在一些问题.

- 如果入口 chunks 之间包含重复的模块, 那些重复模块都会被引入到各个的 bundle 中.
- 这种方法不够灵活, 并且不能将核心应用程序逻辑进行动态拆分代码.

## 9.2 防止重复(prevent duplication)

~~CommonsChunkPlugin 插件可以将公共的依赖模块提取到已有的入口 chunk 中, 或者提取到一个新生成的 chunk.~~(*The CommonsChunkPlugin 已经从 webpack v4 legato 中移除。*使用配置`optimization.splitChunks`)

webpack.config.js

```diff
  const path = require('path');
  const HTMLWebpackPlugin = require('html-webpack-plugin');

  module.exports = {
    entry: {
      index: './src/index.js',
      another: './src/another-module.js'
    },
    plugins: [
      new HTMLWebpackPlugin({
        title: 'Code Splitting'
      })
    ],
+   optimization: {
+   	splitChunks: {
+   		chunks: 'all',
+   		name: 'chunk',
+   	}
+   },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```

配置后, 会看到 `lodash`被分离到单独的 chunk 中. index 和 another 中的 lodash 代码将会被移除.

以下是一些由社区提供的对代码分离很有帮助的插件和 loader:

- [ExtractTextPlugin](https://www.webpackjs.com/plugins/extract-text-webpack-plugin/): 用于将 CSS 从主应用程序中分离. (webpack 4 开始使用 [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin))
- [bundle-loader](https://www.webpackjs.com/loaders/bundle-loader/): 用于分离代码和延迟加载生成的 bundle.
- [promise-loader](https://github.com/gaearon/promise-loader): 类似于 `bundle-loader`, 但是使用的是 promise.

## 9.3 动态导入(dynamic imports)

当涉及到动态代码拆分时, webpack 提供了两种类似的技术. 第一种, 也是优先选择的方式是, 使用符合 ECMAScript 提案的 `import()`语法. 第二种, 则是使用 webpack 特定的 `require.ensure`.

webpack.config.js

```diff
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.js',
  },
  plugins: [new HTMLWebpackPlugin({ title: '动态导入' })],
  output: {
    filename: '[name].bundle.js',
+   chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};

```

scr/index.js

```diff
- import _ from 'lodash';
-
- function component() {
+ function getComponent() {
-   var element = document.createElement('div');
-
-   // Lodash, now imported by this script
-   element.innerHTML = _.join(['Hello', 'webpack'], ' ');
+   return import(/* webpackChunkName: "lodash" */ 'lodash').then(_ => {
+     var element = document.createElement('div');
+
+     element.innerHTML = _.join(['Hello', 'webpack'], ' ');
+
+     return element;
+
+   }).catch(error => 'An error occurred while loading the component');
  }

- document.body.appendChild(component());
+ getComponent().then(component => {
+   document.body.appendChild(component);
+ })
```

由于 `import()`会返回一个 promise, 因此它可以和 `async`函数一起使用. 但可能需要使用像 Babel 这样的预处理器和 Syntax Dynamic Import Babel Plugin.

src/index.js

```diff
- function getComponent() {
+ async function getComponent() {
-   return import(/* webpackChunkName: "lodash" */ 'lodash').then(_ => {
-     var element = document.createElement('div');
-
-     element.innerHTML = _.join(['Hello', 'webpack'], ' ');
-
-     return element;
-
-   }).catch(error => 'An error occurred while loading the component');
+   var element = document.createElement('div');
+   const _ = await import(/* webpackChunkName: "lodash" */ 'lodash');
+
+   element.innerHTML = _.join(['Hello', 'webpack'], ' ');
+
+   return element;
  }

  getComponent().then(component => {
    document.body.appendChild(component);
  });
```

## 9.4 bundle 分析(bundle analysis)

如果我们以分离代码作为开始, 那么就以检查模块作为结束, 分析输出结果是很有用处的. [官方分析工具](https://github.com/webpack/analyse) 是一个好的初始选择(使用命令 `npx webpack --profile --json > stats.json`生成文件并上传以获得分析结果). 下面是一些社区支持的可选工具:

- [webpack-chart](https://alexkuz.github.io/webpack-chart/): webpack 数据交互饼图.
- [webpack-visualizer](https://chrisbateman.github.io/webpack-visualizer/): 可视化并分析你的 bundle, 检查哪些模块占用空间, 哪些可能是重复使用的.
- [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer): 一款分析 bundle 内容的插件及 CLI 工具, 以便捷的, 交互式, 可缩放的树状图形式展现给用户.

# 10. 懒加载

懒加载或者按需加载, 是一种很好的优化网页或应用的方式. 这种方式实际上是先把你的代码在一些逻辑断点处分离开, 然后在一些代码块中完成某些操作后, 立即引用或即将引用另外一些新的代码块. 这样加快了应用的初始加载速度, 减轻了它的总体体积, 因为某些代码块可能永远不会被加载.

## 10.1 示例

在之前代码分离的例子中已经有一部分分离的代码块了, 在技术概念上还是"懒加载"的模块. 但因为加载这个包时并没有交互, 即每次加载页面时就会立即请求它, 这样做不旦没有什么帮助, 还会对性能产生负面影响.

现在试着增加一个交互, 在用户点击按钮时打印一些文字, 但是会在等到第一次产生这个交互时才会去加载代码.

project

```diff
|- package.json
|- webpack.config.js
|- /dist
|- /src
  |- index.js
+ |- print.js
```

## 10.2 框架

许多框架和类库对于如何用它们自己的方式来实现(懒加载)都有自己的建议.

- [React](https://reactrouter.com/web/guides/code-splitting)
- [Vue](https://alexjover.com/blog/lazy-load-in-vue-using-webpack-s-code-splitting/)
- [AngularJS](https://medium.com/@var_bin/angularjs-webpack-lazyload-bb7977f390dd)

# 11. 缓存

使用 webpack 打包应用程序, webpack 会生成一个可部署的 `/dist`目录, 然后把打包后的内容放置在这个目录中. 只要将 `/dist`目录中的内容部署到服务器上, 客户端(通常是浏览器)就能够访问此服务器的资源. 而最后这一步获取资源是比较耗费时间的, 这就是为什么浏览器使用一种名为缓存的技术. 通过命中缓存, 以降低网络流量, 使网站加载速度更快. 然而, 如果我们在部署新版本时不更改资源的文件名, 浏览器可能会认为它没有被更新, 就会使用它的缓存版本. 由于缓存的存在, 当你需要获取新的代码时, 就会显得很棘手.

本节主要是通过必要的配置, 以确保 webpack 编译生成的文件能够被客户端缓存, 而在文件内容变化后, 能够请求到新的文件.

## 11.1 输出文件的文件名 (Output Filenames)

通过使用 `output.filename`进行文件名替换, 可以确保浏览器获取到修改后的文件. `[hash]`替换可以用于在文件名中包含一个构建相关(build-specific)的 hash, 但是更好的方式是使用 `[chunkhash]`替换, 在文件名中包含一个 chunk 相关(chunk-specific)的哈希.

webpack.config.js

```diff
    output: {
-     filename: 'bundle.js',
+     filename: '[name].[chunkhash].js',
      path: path.resolve(__dirname, 'dist')
    }
```

使用此配置, 可以看到 webpack 构建的 bundle 的名称是它内容 (通过 hash)的映射. 如果不修改 `./src/index.js` 文件, 再次运行构建, 我们以为文件名会保持不为. 然而有时情况并非如此.

这是因为 webpack 在入口 chunk 中, 包含了某些样板(boilerplate), 特别是 runtime 和 manifest. (样板 boilerplate 指 webpack 运行时的引导代码)

## 11.2 提取模板 (Extracting Boilerplate)

webpack.config.js

```js
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestWebpackPlugin = require('webpack-manifest-plugin');

module.exports = {
  entry: {
    main: './src/index.js',
    vendor: ['lodash'],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new ManifestWebpackPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: '缓存',
    }),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].js',
  },
};

```

## 11.3 模块标识符 (Module Identifiers)

接下来添加一个模块 `print.js`

project

```diff
|- package.json
|- webpack.config.js
|- /dist
|- /src
  |- index.js
+ |- print.js
```

print.js

```diff
+ export default function print(text) {
+   console.log(text);
+ };
```

index.js

```diff
    import _ from 'lodash';
+    import Print from './print';

    function getComponent() {
      const el = document.createElement('div');
      el.innerHTML = _.join(['Hello', 'Webpack'], ' ');

+      el.onclick = Print.bind(null, 'Hello webpack!');
      return el;
    }

    document.body.appendChild(getComponent());
```

再次运行构建, 我们期望的是, 只有 `main`bundle 的 hash 发生变化, 然而每个文件的 hash 都发生成变化了. 这是因为每个 `module.id`会基于默认的解析顺序(resolve order)进行增量. 也就是说, 当解析顺序发生变化, ID 也会随之改变.

```diff
-	u.push([3, 0]), t();
+	u.push([4, 0]), t();
    })({
-	3: function (e, r, t) {
+	4: function (e, r, t) {
        e.exports = t(0);
      },
```

可以使用 `HashedModuleIdsPlugin`解决 `module.id`的问题.

webpack.config.js

```diff
plugins: [
      new ManifestWebpackPlugin({}),
      new CleanWebpackPlugin(),
+     new webpack.HashedModuleIdsPlugin(),
      new HtmlWebpackPlugin({
        title: '缓存'
      }),
    ],
```

# 12. 创建 library

除了打包应用程序代码, webpack 还可以用于打包 JavaScript library.

## 12.1 创建一个 library

project

```diff
+  |- webpack.config.js
+  |- package.json
+  |- /src
+    |- index.js
+    |- ref.json
```

## 12.2 基本配置

现在, 让我们以某种方式打包这个 library, 能够实现以下几个目标:

- 不打包 `lodash`, 而是使用 `externals`来 require 用户加载好的 lodash.
- 设置 library 的名称为 `webpack-numbers`.
- 将 library 暴露为一个名为 `webpackNumbers`的变量.
- 能够访问其他 Node.js 中的 library.

以外, 用户应该能够通过以下方式访问 library:

- ES2015 模块. 例如 `import webpackNumbers from 'webpack-numbers'`.
- CommonJS 模块. 例如 `require('webpack-numbers')`.
- 全局变量, 当通过 `<script>`脚本引入时.

webpack.config.js

```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'webpack-numbers.js',
  },
};
```

## 12.3 外部化 lodash

现在, 如果执行 `webpack`, 会发现创建了一个非常巨大的文件. 主要是因为 lodash 也被打包到代友中了. 在这种场景中, 我们更倾向于把 `lodash`当作 `peerDependency`. 也就是说, 用户应该已经将 `lodash`安装好. 因此, 你可以放弃对外部 library 的控制, 而是将控制权让给使用 library 的用户.

这可以使用 `externals`配置来完成.

webpack.config.js

```diff
  var path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'webpack-numbers.js'
-   }
+   },
+   externals: {
+     lodash: {
+       commonjs: 'lodash',
+       commonjs2: 'lodash',
+       amd: 'lodash',
+       root: '_'
+     }
+   }
  };
```

这意味着你的 library 需要一个名为 `lodash`的依赖, 这个依赖在用户的环境中必须存在且可用.

> 注意, 如果你计划只是将 library 用作另一个 webpack bundle 中的依赖模块, 则可以将 `externals`指定为数组.

## 12.4 外部扩展的限制

对于从一个依赖目录中, 调用多个文件的 library:

```js
import A from 'library/one';
import B from 'library/two';
// ...
```

无法通过 externals 中指定 `library`目录的方式, 将它们从 bundle 中排除. 你需要逐个排除它们, 或者使用正则表达式排除.

```js
externals: [
    'library/one',
    'library/tow',
    /^library\/.+$/
]
```

## 12.5 暴露 library

对于用途广泛的 library, 我们希望它能够兼容不同的环境, 例如 CommonJS, AMD, Node.js 或者作为一个全局变量. 为了让你的 library 能够在各种用户环境(consumption)中可用, 需要在 `output`中添加 `library`属性:

webpack.config.js

```diff
  var path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
-     filename: 'webpack-numbers.js'
+     filename: 'webpack-numbers.js',
+     library: 'webpackNumbers'
    },
    externals: {
      lodash: {
        commonjs: 'lodash',
        commonjs2: 'lodash',
        amd: 'lodash',
        root: '_'
      }
    }
  };
```

> 注意, `library`设置绑定到 `entry`配置. 对于大多数库, 指定一个入口起点就足够了. 虽然构建多个库也是可以的, 然而还可以直接通过将主入口脚本(index script)暴露部分导出, 来作为单个入口起点则相对简单. **不推荐**使用`数组`作为库的 `entry`.

当你在 import 引入模块时, 这可以将你的 library bundle 暴露为名为 `webpackNumbers`的全局变量. 为了让 library 和其他环境兼容, 还需要在配置文件中添加 `libraryTarget`属性.

webpack.config.js

```diff
  var path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'webpack-numbers.js',
-     library: 'webpackNumbers'
+     library: 'webpackNumbers',
+     libraryTarget: 'umd'
    },
    externals: {
      lodash: {
        commonjs: 'lodash',
        commonjs2: 'lodash',
        amd: 'lodash',
        root: '_'
      }
    }
  };
```

可以通过以下方式暴露 library:

- 变量: 作为一个全局变量, 通过 `script`标签来访问 (libraryTarget: 'var').
- this: 通过 `this`对象访问 (libraryTarget: 'this').
- window: 通过 `window`对象访问, 在浏览器中 (libraryTarget: 'window').
- UMD: 在 AMD 或 CommonJS 的 `require`之后可访问 (libraryTarget: 'umd').

如果设置了 `library`但没设置 `libraryTarget`, 则 `libraryTarget`默认为 `var`.

## 12.6 最终步骤

最后还需要通过设置 `package.json`中的 `main`字段, 添加生成 bundle 文件的路径.

package.json

```json
{
    ...
    "main": "dist/webpack-numbers.js"
    ...
}
```

或者添加为标准模块

```json
{
    ...
    "module": "src/index.js"
    ...
}
```

`main`是 `package.json`标准, `module`是一个提案, 此提案允许 JavaScript 生态系统升级使用 ES2015 模块, 而不会破坏向后兼容性.

> `module`属性应指向一个使用 ES2015 模块语法的脚本, 但不包括浏览器或 Node.js 尚不支持的其他语法特性. 这使得 webpack 本身就可以解析模块语法, 如果用户只用到 library 的某些部分, 则允许通过 tree shaking 打包更轻量的包.

# 13. shimming

`webpack`编译器(compiler)能够识别遵循 ES2015 模块语法, CommonJS 或 AMD 规范编写的模块. 然而, 一些第三方的库(library)可能会引用一些全局依赖(例如 `jQuery`中的 `$`). 这些库也可能创建一些需要被导出的全局变量. 这些"不符合规范的模块"就是 shimming 发挥作用的地方.

> 我们不推荐使用全局的东西! 在 webpack 背后的整个概念是让前端开发更加模块化. 也就是说, 需要编写具有良好的封闭性(well contained), 彼此隔离的模块, 以及不要依赖于那些隐含的依赖模块(例如, 全局变量).

shimming 另外一个使用场景就是, 当你希望 polyfill 浏览器功能以支持更多用户时. 在这些情况下, 你可能只想要将 polyfills 提供给到需要修补(patch)的浏览器(也就是实现按需加载).

## 13.1 shimming 全局变量

src/index.js

```diff
- import _ from 'lodash';
-
  function component() {
    var element = document.createElement('div');

-   // Lodash, now imported by this script
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    return element;
  }

  document.body.appendChild(component());
```

webpack.config.js

```diff
  const path = require('path');
+ const webpack = require('webpack');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
-   }
+   },
+   plugins: [
+     new webpack.ProvidePlugin({
+       _: 'lodash'
+     })
+   ]
  };
```

本质上, 我们所做的, 就是告诉 webpack, 如果遇到至少一处用到 `lodash`变量的模块实例(`_`), 那就将 `lodash`package 包引入, 并将其提供给需要用到它的模块.

我们还可以使用 `ProvidePlugin`暴露某个模块中单个导出值, 只需要通过一个"数组路径"进行配置(例如 `[module, child, ...children?]`). 所以, 如果想单独提供 `join`方法, 可以这样:

scr/index.js

```diff
  function component() {
    var element = document.createElement('div');

-   element.innerHTML = _.join(['Hello', 'webpack'], ' ');
+   element.innerHTML = join(['Hello', 'webpack'], ' ');

    return element;
  }

  document.body.appendChild(component());
```

webpack.config.js

```diff
  const path = require('path');
  const webpack = require('webpack');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    plugins: [
      new webpack.ProvidePlugin({
-       _: 'lodash'
+       join: ['lodash', 'join']
      })
    ]
  };
```

这样就能很好的与 tree shaking 配合, 将 `lodash`库中的其他没用到的部分去除.

## 13.2 细粒度 shimming

一些传统的模块依赖的 `this`指向的是 `window`对象.

src/index.js

```diff
  function component() {
    var element = document.createElement('div');

    element.innerHTML = join(['Hello', 'webpack'], ' ');
+
+   // Assume we are in the context of `window`
+   this.alert('Hmmm, this probably isn\'t a great idea...')

    return element;
  }

  document.body.appendChild(component());
```

当模块运行在 CommonJS 环境下这将会变成一个问题, 也就是说此时的 this 指向的是 `module.exports`

webpack.config.js

```diff
  const path = require('path');
  const webpack = require('webpack');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
+   module: {
+     rules: [
+       {
+         test: require.resolve('index.js'),
+         use: 'imports-loader?this=>window'
+       }
+     ]
+   },
    plugins: [
      new webpack.ProvidePlugin({
        join: ['lodash', 'join']
      })
    ]
  };
```

## 13.3 全局 exports

project

```diff
  |- package.json
  |- webpack.config.js
  |- /dist
  |- /src
    |- index.js
+   |- globals.js
```

webpack.config.js

```diff
  const path = require('path');
  const webpack = require('webpack');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test: require.resolve('index.js'),
          use: 'imports-loader?this=>window'
-       }
+       },
+       {
+         test: require.resolve('globals.js'),
+         use: 'exports-loader?file,parse=helpers.parse'
+       }
      ]
    },
    plugins: [
      new webpack.ProvidePlugin({
        join: ['lodash', 'join']
      })
    ]
  };
```

## 13.4 加载 polyfills

引入 babel-polyfill:

```bash
npm i babel-polyfill
```

src/index.js

```diff
+ import 'babel-polyfill';
+
  function component() {
    var element = document.createElement('div');

    element.innerHTML = join(['Hello', 'webpack'], ' ');

    return element;
  }

  document.body.appendChild(component());
```

> 注意, 我们没有将 `import`绑定到变量. 这是因为只需在基础代码(code base)之外, 再额外执行 polyfills, 就可以假定代码中已经具有某些原生功能了.

polyfills 虽然是一种模块引入方式, 但是**并不推荐在主 bundle 中引入 polyfills**, 因为这不利于具备这些模块功能的现代浏览器用户, 会使他们下载体积很大, 但却不需要的脚本文件.

更好的办法是将 `import 'babel-polyfill'`放入一个新文件, 并加入 whatwg-fetch polyfill.

```bash
npm i whatwg-fetch
```

project

```diff
  |- package.json
  |- webpack.config.js
  |- /dist
  |- /src
    |- index.js
    |- globals.js
+   |- polyfills.js
```

src/polyfills.js

```js
import 'babel-polyfill';
import 'whatwg-fetch';
```

webpack.config.js

```diff
-   entry: './src/index.js',
+   entry: {
+     polyfills: './src/polyfills.js',
+     index: './src/index.js'
+   },
    output: {
-     filename: 'bundle.js',
+     filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
```

将代码分离后, 可以在 index.html 中添加一些逻辑根据条件加载新的 `polyfills.bundle.js`

dist/index.html

```diff
  <!doctype html>
  <html>
    <head>
      <title>Getting Started</title>
+     <script>
+       var modernBrowser = (
+         'fetch' in window &&
+         'assign' in Object
+       );
+
+       if ( !modernBrowser ) {
+         var scriptElement = document.createElement('script');
+
+         scriptElement.async = false;
+         scriptElement.src = '/polyfills.bundle.js';
+         document.head.appendChild(scriptElement);
+       }
+     </script>
    </head>
    <body>
      <script src="index.bundle.js"></script>
    </body>
  </html>
```

## 13.5 深度优化

`babel-preset-env`package 使用 browserslist 来转译那些浏览器中不支持的特性. 这里预设了 `useBuiltIns`选项, 默认值是 `false`, 能将你的全局 `babel-polyfill`导入方式, 改进为更细粒度的 `import`格式:

```js
import 'core-js/modules/es7.string.pad-start';
import 'core-js/modules/es7.string.pad-end';
import 'core-js/modules/web.timers';
import 'core-js/modules/web.immediate';
import 'core-js/modules/web.dom.iterable';
```

## 13.6 Node 内置

像 `process`这种 Node 内置模块, 能直接根据配置文件(configuration file)进行正确的 polyfills, 且不需要特定的 loaders 或者 plugins.

## 13.7 其他工具

还有一些其他的工具能够帮我们处理老旧的模块.

`script-loader`会在全局上下文中对代码进行取值, 类似于通过一个 `script`标签引入脚本. 在这种模式下, 每一个标准的库都应该能正常运行. require, module 等的取值是 undefined.

> 当使用 `script-loader` , 模块将转化为字符串, 然后添加到 bundle 中. 它不会被 `webpack`压缩, 所以你应该选择一个 min 版本. 同时, 使用此 loader 将不会有 `devtool`的支持.

这些老旧的模块如果没有 AMD/CommonJS 规范版本, 但你也想将他们加入 `dist`文件, 可以使用 `noParse`来标识出这个模块. 这样就能使 webpack 引入这些模块, 但不进行转化(parse), 以及不解析(resolve) `require()`和 `import`语句. 这将提升构建性能.

> 例如: `ProvidePlugin`, 任何需要 AST 的功能, 都无法正常运行.

最后, 有一些模块支持不同的模块格式, 比如 AMD 规范, CommonJS 规范和遗留模块(legacy). 在大多数情况下, 他们首先检查 `define`, 然后使用一些古怪的代码来导出一些属性. 在这些情况下, 可以通过 `imports-loader`设置 `define=>false`来强制 CommonJS 路径.

# 14. 渐进式网络应用程序

渐进式网络应用程序(Progressive Web Application - PWA), 是一种可以提供类似于原生应用程序(native app)体验的网络应用程序(web app). PWA 可以用来做很多事. 其中最重要的是, 在**离线(offline)**时应用程序能够继续运行功能. 这是通过使用名为 Service Workers 的网络技术来实现的.

## 14.1 现在我们并没有离线环境下运行过

到目前为止, 用户通过网络访问网络应用程序, 用户的浏览器会与一个提供所需资源(例如: .html, .js 和 .css 文件)的服务器通讯. 

现在开始使用一个简易服务器, 搭建出离线体验.

```bash
npm i -D http-server
```

运行

```bash
npx http-server dist
```

此时, 用浏览器访问 `http://127.0.0.1:8080`将看到基于 `dist`目录创建出的服务, 此时停止服务器并刷新, 该应用程序将不再可访问.

接下来要实现的就是, 既然服务器停止了, 刷新后应用程序仍然可以正常运行.

## 14.2 添加 Workbox

添加 workbox-webpack-plugin 插件.

```bash
npm i -D workbox-webpack-plugin
```

webpack.config.js

```diff
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const CleanWebpackPlugin = require('clean-webpack-plugin');
+ const WorkboxPlugin = require('workbox-webpack-plugin');

  module.exports = {
    entry: {
      app: './src/index.js',
      print: './src/print.js'
    },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
-     title: 'Output Management'
+     title: 'Progressive Web Application'
-   })
+   }),
+   new WorkboxPlugin.GenerateSW({
+     // 这些选项帮助 ServiceWorkers 快速启用
+     // 不允许遗留任何“旧的” ServiceWorkers
+     clientsClaim: true,
+     skipWaiting: true
+   })
  ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```

## 14.3 注册 Service Worker

index.js

```diff
  import _ from 'lodash';
  import printMe from './print.js';

+ if ('serviceWorker' in navigator) {
+   window.addEventListener('load', () => {
+     navigator.serviceWorker.register('/service-worker.js').then(registration => {
+       console.log('SW registered: ', registration);
+     }).catch(registrationError => {
+       console.log('SW registration failed: ', registrationError);
+     });
+   });
+ }
```

> 要注意, Service Worker 无法运行在 ip 上, 必须要 localhost 访问.

此时即使服务器停止了服务, 应用程序仍然可以正常运行, 因为此刻是由 Service Worker 提供服务.

# 15. TypeScript

## 15.1 基础安装

首先安装 TypeScript 编译器(compiler)和 loader :

```bash
npm i -D typescript ts-loader
```

project

```diff
  |- package.json
+ |- tsconfig.json
  |- webpack.config.js
  |- /dist
    |- bundle.js
    |- index.html
  |- /src
    |- index.js
+   |- index.ts
```

tsconfig.json

```json
{
  "compilerOptions": {
    "outDir": "./dist/",
    "noImplicitAny": true,
    "module": "ES6",
    "target": "ES5",
    "jsx": "react",
    "allowJs": true
  }
}
```

webpack.config.js

```js
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

将 webpack 入口指定为 `index.ts`, 然后通过 `ts-loader`加载所有的 `.ts`和 `.tsx`文件, 并且在当前目录输出一个 `bundle.js`文件.

## 15.2 Loader

[ts-loader](https://github.com/TypeStrong/ts-loader)

## 15.3 source map

要启动 source map 必须配置 TypeScript, 以将内联的 source map 输出到编译过的 JavaScript 文件.

tsconfig.json

```diff
  {
    "compilerOptions": {
      "outDir": "./dist/",
+     "sourceMap": true,
      "noImplicitAny": true,
      "module": "commonjs",
      "target": "es5",
      "jsx": "react",
      "allowJs": true
    }
  }
```

然后告诉 webpack 提取这些 source map, 并内联到最终的 bundle 中.

webpack.config.js

```diff
  const path = require('path');

  module.exports = {
    entry: './src/index.ts',
+   devtool: 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ]
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```

## 15.4 使用第三方库

当从 npm 安装第三方库时, 一定要同时安装这个库的类型声明文件. 你可以从 [TypeSearch](http://microsoft.github.io/TypeSearch/) 中找到并安装这些第三方库的类型声明文件.

想了解更多, 可以查看[这篇文章](https://devblogs.microsoft.com/typescript/the-future-of-declaration-files-2/).

## 15.5 导入其他资源

要在 TypeScript 里使用非代码资源, 需要先告诉 TypeScript 如何兼容这些导入类型. 首先在项目里创建 `custom.d.ts`文件.

custom.d.ts

```tsx
declare module "*.svg" {
    const content: any;
    export default content;
}
```

这里通过指定任何以 `.svg`结尾的导入, 并将模块的 `content`定义为 `any`, 将 SVG 声明为一个新模块. 这里可以将类似从 `any`改为 `string`, 以更加显式地将它声明为一个 url. 同样的理念适用于其他资源, 包括 CSS, SCSS, JSON 等.

## 15.6 构建性能

使用 TypeScript, 构建性能可能会降低.

# 16. 迁移到新版本

主要描述的是 webpack 1 到 2 的变化.

# 17. 使用环境变量

要在开发和生产环境之间, 消除 `webpack.config.js`的差异, 你可能需要环境变量.

webpack 命令行环境配置中, 通过设置 `--env`可以使你根据需要, 传入尽可能多的环境变量. 在 `webpack.config.js`文件中可以访问到这些环境变量. 例如, `--env.production`或 `--env.NODE_ENV=local`(`NODE_ENV`通常约定用于定义环境类型)

```bash
webpack --env.NODE_ENV=local --env.production --progress
```

> 如果设置 `env`变量, 却没有赋值, `--env.production`默认将 `--env.production`设置为 `true`

然而, 你必须对 webpack 配置进行一处修改. 通常, `module.exports`指向配置对象. 但要使用 `env`, 必须将 `module.exports`转换成一个函数.

webpack.config.js

```js
const path = require('path');

console.log('NODE_ENV: ', process.env.NODE_ENV); // undefined
console.log('Production: ', process.env.production); // undefined

module.exports = (env) => {
  console.log('NODE_ENV: ', env.NODE_ENV); // local
  console.log('Production: ', env.production); // true
  return {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
  };
};
```

# 18. 构建性能

## 18.1 保持版本最新

使用 webpack 最新稳定版本, 保持最新的 Node.js, 包管理工具 (npm 或 yarn), 能够建立更高效的模块树以及提高解析速度.

## 18.2 Loaders

将 loaders 应用于最少数的必要模块, 如:

```js
{
    test: /\.js$/,
    loader: 'babel-loader'
}
```

使用 `include`字段仅将 loader 模块应用在实际需要用其转换的位置中:

```js
{
    test: /\.js$/,
    include: path.resolve(__dirname, 'src'),
    loader: 'babel-loader'
}
```

## 18.3 Bootstrap

每个额外的 loader/plugin 都有启动时间. 尽量少使用不同的工具.

## 18.4 解析

- 尽量减少 `resolve.modules`, `resolve.extensions`, `resolve.mainFiles`, `resolve.descriptionFiles`中类目的数量, 因为它们会增加文件系统调用的次数.
- 如果你不使用 `symlinks`, 可以设置 `resolve.symlinks: false`(例如 `npm link`或者 `yarn link`).
- 如果使用自定义解析 plugins, 并且没有指定 context 信息, 可以设置 `resolve.cacheWithContext: false`.

## 18.5 Dlls

使用 `DllPlugin`将更改不频繁的代码进行单独编译. 这将改善引用程序的编译速度, 即使它增加了构建过程的复杂性.

## 18.6 Smaller = Faster

减少编译的整体大小, 以提高构建性能. 尽量保持 chunks 小巧.

- 使用 更少/更小 的库.
- 在多页面应用程序中使用 `CommonsChunksPlugin`.
- 在多页面应用程序中以 `async`模式使用 `CommonsChunksPlugin`.
- 移除不使用的代码.
- 只编译当前正在开发部分的代码.

## 18.7 Worker Pool

`thread-loader`可以将非常消耗资源的 loaders 转存到 worker pool 中.

> 不要使用太多的 workers, 因为 Node.js 的 runtime 和 loader 有一定的启动开销. 最小化 workers 和主进程间的模块传输. 进程间通讯(IPC)是非常消耗资源的.

## 18.8 持久化缓存

使用 `cache-loader`启用持久化缓存. 使用 `package.json`中的 `"postinstall"`清除缓存目录.

## 18.9 Development

### 1. 增量编译

使用 webpack 的监听模式. 不要使用其他工具来监听你的文件和调用 webpack. 在监听模式下构建会记录时间戳并将信息传递给编译让缓存失效.

在某些设置中, 监听会回退到轮询模式. 有许多监听文件会导致 CPU 大量负载. 在这些情况下, 你可以使用 `watchOptions.poll`来增加轮询的间隔.

### 2. 在内存中编译

以下几个实用工具通过在内存中进行代码的编译和资源的提供, 但并不写入磁盘以提高性能:

- `webpack-dev-server`
- `webpack-hot-middleware`
- `webpack-dev-middleware`

### 3. Devtool

需要注意的是不同的 `devtool`的设置, 会导致不同的性能差异.

- `eval`具有最好的性能, 但并不能帮助你转译代码.
- 如果你能接受稍差一些的 mapping 质量, 可以使用 `cheap-source-map`选项来提高性能.
- 使用 `eval-source-map`配置进行增量编译.

在大多数情况下, `cheap-module-eval-source-map`是最好的选择.

### 4. 避免在生产环境下才会用到的工具

某些实用工具, plugins 和 loaders 都只能在构建生产环境时才有用, 比如压缩代码在生产环境下并没有多大意义. 所以以下这些工具在开发中通常被排除在外:

- `UglifyJsPlugin`
- `ExtractTextPlugin`
- `[hash] / [chunkhash]`
- `AggressiveSplittingPlugin`
- `AggressiveMergingPlugin`
- `ModuleConcatenationPlugin`

### 5. 最小化入口 chunk

webpack 只会在文件系统中生产已经更新的 chunk. 对于某些配置选项(HMR, `[name] / [chunkhash]`, `output.chunkFilename`, `[hash]`)来说. 除了更新的 chunks 无效之外, 入口 chunk 也不会生效.

应当在生成入口 chunk 时, 尽量减少入口 chunk 的体积, 以提高性能. 下述代码块将只提取包含 runtime 的 chunk, 其他 chunk 都作为子模块.

```js
new CommonsChunkPlugin({
    name: "manifest",
    minChunks: Infinity
})
```

## 18.10 Production

### 1. 多个编译时

当进行多个编译时, 以下工具可以帮助到你:

- `parallel-webpack`: 它允许编译工作在 worker 池中进行.
- `cache-loader`: 缓存可以在多个编译时之间共享.

### 2. Source Maps

Source maps 真的很消耗资源. 你真的需要他们?

## 18.11 工具相关问题

下列工具存在某些可能会降低构建性能的问题.

### 1. Babel

- 项目中的 preset/plugins 数量最小化.

### 2. TypeScript

- 在单独的进程中使用 `fork-ts-checker-webpack-plugin`进行类型检查.
- 配置 loaders 跳过类型检查.
- 使用 `ts-loader`时, 设置 `happyPackMode: true`/ `transpileOnly: true`.

### 3. Sass

- `node-sass`中有个来自 Node.js 线程池的阻塞线程的 bug. 当使用 `thread-loader`时, 需要设置 `workerParallelJobs: 2`.

# 19. 内容安全策略

webpack 能够为其加载的所有脚本添加 `nonce`. 要启用此功能, 需要在引入的入口脚本中设置一个 `__webpack_nonce__`变量. 应该为每个唯一的页面视图生成和提供一个唯一的基于 hash 的 nonce, 这就是为什么 `__webpack_nonce__`要在入口文件中指定, 而不是在配置中指定的原因. 请注意, `nonce`应该是一个 base64 编码的字符串.

## 19.1 示例

在 entry 文件中:

```js
__webpack__nonce__ = 'c29tZSBjb29sIHN0cmluZyB3aWxsIHBvcCB1cCAxMjM=';
```

## 19.2 启用 CSP

注意, CSP 默认情况下不启用. 需要与文档(document)一起发送相应的 `CSP`header 或 meta 标签 `<meta http-equiv="Content-Security-Policy" ...>`, 以告知浏览器启用 CSP. 以下是一个包含 CDN 白名单 URL 的 CSP header 的示例:

```js
Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted.cdn.com;
```

# 20. 开发 - Vagrant

# 21. 管理依赖

## 21.1 带表达式的 require 语句

如果你的 request 含有表达式(expressions), 会创建一个上下文(context), 因为在编译时(compile time)并不清楚具体是哪一个模块被导入.

比如:

```js
require('./template/' + name + '.ejs');
```

webpack 解析 `require()`的调用, 会提取出来如下信息:

```
Directory: ./template
Regular expression: /^.*\.ejs$/
```

此时这个具有上下文的模块会包含目录下的所有模块的引用(reference), 这些模块能够[通过从 request 匹配出来的正则表达式]所 require 进来. 上下文模块包含一个 map 对象, 会把 request 中所有模块转译成对应的模块 id.

示例:

```js
{
    './table.ejs': 42,
    './table-row.ejs': 43,
    './directory/folder.ejs': 44
}
```

上下文模块还包含一些运行时(runtime)逻辑来访问这个 map 对象.

这意味着 webpack 能够支持动态 require, 但会导致所有可能用到的模块都包含在 bundle 中.

## 21.2 `require.context`

你还可以使用 `require.context()`方法来创建自己的模块上下文.

你可以给这个方法传3个参数, 要搜索的文件夹目录, 是否还应该搜索它的子目录, 以及一个匹配文件的正则表达式.

webpack 会在构建的时候解析代码中的 `require.context()`.

语法如下:

```js
require.context(directory, useSubdirectories = false, regExp = /^\.\//)
```

> 注意, 传递给 `require.context`的参数必须是字面量(literal)!

## 21.3 上下文模块 API

一个上下文模块导出一个 (require) 函数, 这个函数可以接收一个参数: request.

导出的方法有 3 个属性: `resolve`, `keys`, `id`.

- `resolve`是一个函数, 它返回请求被解析后得到的模块 id.
- `keys`是一个函数, 它返回一个数组, 由所有可能被上下文模块处理的请求组成.

比如, 如果想引入一个文件夹下面的所有文件, 或者引入能匹配正则表达式的文件, 你可以这样.

```js
const cache = {};

function importAll(r) {
    r.keys().forEach(key => cache[key] = r(key));
}
importAll(require.context('../components', true, /\.js$/));
// 在构建时, 所有被 require 的模块都会被存到 cache 里面.
```

# 22. 公共路径 (public path)

webpack 提供一个非常有用的配置, 该配置能帮助你为项目中的所有资源指定一个基础路径. 它被称为 `公共路径(publicPath)`

## 22.1 在构建项目时设置路径值

在开发模式中, 我们通常有一个 `assets/`文件夹, 它往往存放在和首页一个级别的目录下. 但是在生产环境下, 如果想把这些静态文件统一使用 CDN 加载, 该怎么办?

可以使用有着悠久历史的环境变量, 比如设置一个名为 `ASSET_PATH`的变量:

```js
import webpack from 'webpack';

const ASSET_PATH = process.env.ASSET_PATH || '/';

export default {
    output: {
        publicPath: ASSET_PATH
    }
    plugins: [
    	new webpack.DefinePlugin({'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH)})
    ]
}
```

## 22.2 即时设定路径值

另一个可能出现的情况是, 我们需要即时设置公共路径. `webpack`提供一个全局变量供你设置, 它名叫 `__webpack_public_path__`. 所以在你的项目入口, 你可以设置如下:

```js
__webpack_public_path__ = process.env.ASSET_PATH;
```

当设置完成后, 因为我们已经在配置荐中使用了 `DefinePlugin`, `process.env.ASSET_PATH`就已经被定义了, 所以我们能够安心地使用它.

警告: 请注意, 如果你在入口文件中使用 ES6 模块导入, 则在导入后对 `__webpack_public_path__`进行赋值. 在这种情况下, 你必须将公共路径(public path)赋值移至自己的专属模块, 然后将其导入到你的 entry.js 之上:

```js
// entry.js
import './public-path';
import './app';
```

# 23. 集成 (integrations)

首先我们要消除一个常见的误解. webpack 是一个模块打包器(module bundler) (例如, Browserify 或 Brunch). 它不是一个任务执行器(task runner) (例如, Make, Grunt 或者 Gulp). 任务执行器就是用来自动化处理常见的开发任务, 例如项目的检查(lint), 构建(build), 测试(test). 相对于打包器(bundler), 任务执行器则聚焦在偏重上层的问题上面. 你可以得益于, 使用上层的工具, 而将打包部分的问题留给 webpack.

打包器(bundler)帮助你取得准备用于部署的 JavaScript 和样式表, 将它们转换为适合浏览器的可用格式. 例如, JavaScript 可以压缩, 拆分 chunk 和懒加载, 以提高性能. 打包是 web 开发中最重要的挑战之一, 解决此问题可以消除开发过程中的大部分痛点.

发消息是, 虽然有一些功能重复, 但如果以正确的方式处理, 任务运行器和模块打包器能够一起协同工作.

## 23.1 NPM Scripts

通常 webpack 用户使用 npm scripts 来作为任务执行器. 这是比较好的开始. 然而跨平台支持是一个问题, 为此有一些解决方案. 许多用户, 但不是大多数用户, 直接使用 npm scripts 和各种级别的 webpack 配置和工具, 来应对构建任务.

因此, 当 webpack 的核心焦点专注于打包时, 有多种扩展可以供你使用, 可以将其用于任务运行者常见的工作. 集成一个单独的工具会增加复杂度, 所以一定要权衡集成前后的利弊.

## 23.2 Grunt

对于那些使用 Grunt 的人, 推荐使用 `grunt-webpack`包(package). 使用 `grunt-webpack`可以将 webpack 或 webpack-dev-server 作为一项任务(task)执行, 访问模板标签(template tags)中的统计信息, 拆分开发和生产配置等等.

```bash
npm i -D grund-webpack webpack
```

Gruntfile.js

```js
const webpackConfig = require('./webpack.config');

module.exports = function (grunt) {
  grunt.initConfig({
    webpack: {
      options: {
        stats: !process.env.NODE_ENV || process.env.NODE_ENV === 'development',
      },
      prod: webpackConfig,
      dev: Object.assign({ watch: true }, webpackConfig),
    },
  });
  grunt.loadNpmTasks('grunt-webpack');

  grunt.registerTask('default', ['webpack']);
};
```

## 23.3 Gulp

在 `webpack-stream`包(package) (也称作 `gulp-webpack`)的帮助下, 也可以很简单的将 Gulp 和 webpack 集成.

```bash
npm i -D webpack-stream
```

gulpfile.js

```js
const gulp = require('gulp');
const webpack = require('webpack-stream');
const webpackConfig = require('./webpack.config');
gulp.task('default', function () {
  return gulp
    .src('./src/index.js') //
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('./dist'));
});

```

## 23.4 Mocha

`mocha-webpack`可以用来将 Mocha 与 webpack 完全集成. 这个仓库提供了很多关于工具优势和缺点方面的细节, 但 `mocha-webpack`还算是一层简单的封装, 提供与 Mocha 几乎相同的 CLI, 并提供各种 webpack 功能, 例如改进了 watch 模式和优化了路径分析(path resolution).

```bash
npm i -D mocha mocha-webpack
mocha-webpack 'test/**/*.js'
```

## 23.5 Karma

