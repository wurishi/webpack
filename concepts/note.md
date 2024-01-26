[webpack 概念](https://www.webpackjs.com/concepts/entry-points/)

# 1. 概念

本质上, webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler). 当 webpack 处理应用程序时, 它会递归地构建一个依赖关系图(dependency graph), 其中包含应用程序需要的每个模块, 然后将所有这些模块打包成一个或多个 bundle.

从 webpack v4.0.0 开始, 可以不用引用一个配置文件. 然而, webpack 仍然还是高度可配置的. 在开始前需要先理解四个**核心概念**:

- 入口 (entry)
- 输出 (output)
- loader (module)
- 插件 (plugins)

## 1.1 入口 (entry)

**入口起点(entry point)**指示 webpack 应该使用哪个模块, 来作为构建其内部依赖图的开始. 进行入口起点后, webpack 会找出有哪些模块和库是入口起点(直接和间接)依赖的.

每个依赖项随即被处理, 最后输出到称之为 bundles 的文件中.

可以通过在 webpack 配置中配置 `entry`属性, 来指定一个入口起点(或多个入口起点). 默认值为 `./src`.

## 1.2 出口 (output)

`output` 属性告诉 webpack 在哪里输出它所创建的 bundles, 以及如何命名这些文件, 默认值为 `./dist`.基本上, 整个应用程序结构, 都会被编译到你指定的输出路径的文件夹中. 你可以通过在配置中指定一个 `output`字段, 来配置这些处理过程.

## 1.3 loader (module)

loader 让 webpack 能够去处理那些非 JavaScript 文件 (webpack 自身只理解 JavaScript). loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块, 然后你就可以利用 webpack 的打包能力, 对它们进行处理.

本质上, webpack loader 将所有类型的文件, 转换为应用程序的依赖图(和最终的 bundle)可以直接引用的模块.

> 注意, loader 能够 `import`导入任何类型的模块(例如 `.css`文件), 这是 webpack 特有的功能, 其他打包程序或任务执行器的可能并不支持. webpack 认为这种语言扩展是很有必要的, 因为这可以使开发人员创建出更准确的依赖关系图.

在 webpack 的配置中 loader 有两个目标:

1. `test`属性, 用于标识出应该被对应的 loader 进行转换的某个或某些文件.
2. `use`属性, 表示进行转换时, 应该使用哪个 loader.

```js
module: {
    rules: [
      {
        test: /\.txt$/,
        use: 'raw-loader',
      },
    ],
  },
```

以上配置中, 对一个单独的 module 对象定义了 `rules`属性, 里面包含了两个必须的属性: `test`和 `use`. 这告诉 webpack 编译器(compiler)如下信息:

> webpack 编译器, 当你碰到 「在 `require() / import`语句中被解析为 '.txt'的路径」时, 在你对它打包之前, 先使用 `raw-loader`转换一下.

## 1.4 插件 (plugins)

loader 被用于转换某些类型的模块, 而插件则可以用于执行范围更广的任务. 插件的范围包括, 从打包优化和压缩, 一直到重新定义环境中的变量. 插件接口功能极其强大, 可以用于处理各种各样的任务.

想要使用一个插件, 你只需要 `require()`它, 然后把它添加到 `plugins`数组中. 多数插件可以通过选项(option)自定义. 也可以在一个配置文件中因为不同目的而多次使用同一个插件, 这时需要通过使用 `new`操作符来创建它的一个实例.

## 1.5 模式 (mode)

通过选择 `development`或 `production`之中的一个, 来设置 `mode`参数, 你可以启用相应模式下的 webpack 内置的优化.

# 2. 入口起点 (entry points)

## 2.1 单个入口(简写)语法

用法: `entry: string|Array<string>`

```js
const config = {
    entry: './path/to/my/entry/file.js'
};
module.exports = config;
```

以上这种单个入口的语法, 是下面的简写:

```js
const config = {
    entry: {
        main: './path/to/my/entry/file.js'
    }
};
```

**当 `entry`传入一个数组时会发生什么?**

向 `entry`属性传入「文件路径(file path)数组」将创建"多**个主入口(multi-main entry)**". 如果想要多个依赖文件一起注入, 并且将它们的依赖导向(graph)到一个"chunk"时, 传入数组的方式就很有用.

简写方式适用于只有一个入口起点的应用程序或工具, 但会失去扩展配置时的灵活性.

## 2.2 对象语法

用法: `entry: {[entryChunkName: string]: string|Array<string>}`

```js
const config = {
    entry: {
        app: './src/app.js',
        vendors: './src/vendors.js'
    }
};
```

对象语法会比较繁琐. 然而, 这是应用程序中定义入口的最可扩展方式.

> **"可扩展的 webpack 配置"**是指, 可重用并且可以与其他配置组合使用. 这是一种流行的技术, 用于将关注点(concern)从环境(environment), 构建目标(build target), 运行时(runtime)中分离. 然后使用专门的工具(如 webpack-merge)将它们合并.

## 2.3 常见场景

### 2.3.1 分离 应用程序(app) 和 第三方库 (vendor) 入口

```js
const config = {
    entry: {
        app: './src/app.js',
        vendors: './src/vendors.js'
    }
};
```

**这是什么?**

从表面上看, 这告诉我们 webpack 从 `app.js`和 `vendor.js`开始创建依赖图(dependency graph). 这些依赖图是彼此完全分离, 互相独立的(每个 bundle 中都有一个 webpack 引导(bootstrap)). 这种方式比较常见于, 只有一个入口起点(不包括 vendor)的单面应用程序(single page application SPA)中.

**为什么?**

此设置允许你使用 `CommonsChunkPlugin`从「应用程序 bundle」中提取 vendor 引用(vendor reference)到 vendor bundle, 并把引用 vendor 的部分替换为 `__webpack_require__()`调用. 如果应用程序 bundle 中没有 vendor 代码, 那么你可以在 webpack 中实现被称为长效缓存(见: 指南 11.缓存)的通用模式.

### 2.3.2 多页面应用程序

```js
const config = {
    pageOne: './src/pageOne/index.js',
    pageTwo: './src/pageTwo/index.js',
    pageThree: './src/pageThree/index.js'
};
```

**这是什么?**

告诉 webpack 需要3个独立分离的依赖图.

**为什么?**

在多页应用中, 每次页面跳转都会获取一个新的 HTML 文档. 页面会重新加载文档, 并且资源会重新下载. 这给了我们特殊的机会去做很多事:

- 使用 `CommonsChunkPlugin`为每个页面间的应用程序共享代码创建 bundle. 由于入口起点增多, 多页应用能够复用这些共享代码/模块.

# 3. 输出 (output)

配置 `output`选项可以控制 webpack 如何向硬盘写入编译文件. 注意, 即使可以存在多个 `入口`起点, 但只能指定一个 `输出`配置.

## 3.1 用法 (Usage)

在 webpack 中配置 `output`属性的最低要求是, 将它的值设置为一个对象, 包括以下两点:

- `filename`用于输出文件的文件名.
- `path`目标输出目录(绝对路径)

## 3.2 多个入口起点

如果配置创建了多个单独的"chunk" (例如, 使用多个入口起点或使用像 CommonsChunkPlugin 这样的插件), 则应该使用占位符(substitutions)来确保每个文件具有唯一的名称.

```js
const config = {
    // ...
    entry: {
        app: './src/app.js',
        search: './src/search.js'
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/dist'
    }
}
```

## 3.3 高级进阶

使用 CDN 和资源 hash 的复杂示例:

```js
const config = {
    // ...
    output: {
        path: '/home/proj/cdn/assets/[hash]',
        publicPath: 'http://cdn.example.com/assets/[hash]/'
    }
};
```

# 4. 模式 (mode)

提供 `mode`配置选项, 告知 webpack 使用相应模式的内置优化. `string`

## 4.1 用法

只在配置中提供 `mode`选项:

```js
module.exports = {
    mode: 'production'
};
```

或者从 CLI 参数中传递:

```bash
webpack --mode=production
```

支持以下字符串值:

| 选项          | 描述                                                         |
| ------------- | ------------------------------------------------------------ |
| `development` | 会将 `process.env.NODE_ENV`的值设为 `development`. 启用 `NamedChunksPlugin` 和 `NamedModulesPlugin`. |
| `production`  | 会将 `process.env.NODE_ENV`的值设为 `production`. 启用 `FlagDependencyUsagePlugin`, `FlagIncludedChunksPlugin`, `ModuleConcatenationPlugin`, `NoEmitOnErrorsPlugin`, `OccurrenceOrderPlugin`, `SideEffectsFlagPlugin` 和 `UglifyJsPlugin`. |

> 注意: 只设置 `NODE_ENV`, 则不会自动设置 `mode`.

**mode: development**

```js
module.exports = {
    mode: 'development',
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("development")
        }),
    ]
}
```

**mode: production**

```js
module.exports = {
    mode: 'production',
    plugins: [
        new UglifyJsPlugin(/* ... */),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("production")
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
}
```

# 5. loader

loader 用于对模块的源代码进行转换. loader 可以使你在 `import`或"加载"模块时预处理文件. 因此, loader 类似于其他构建工具中"任务(task)", 并提供了处理前端构建步骤的强大方法. loader 可以将文件从不同的语言(如 TypeScript)转换为 JavaScript, 或将内联图像转换为 data URL. loader 甚至允许你直接在 JavaScript 模块中 `import`CSS文件!

## 5.1 示例

可以使用 loader 告诉 webpack 加载 CSS 文件, 或者将 TypeScript 转为 JavaScript. 为此, 首先安装相对应的 loader:

```bash
npm i -D css-loader
npm i -D ts-loader
```

然后指示 webpack 对每个 `.css`使用 `css-loader`(一般还需要配合 `style-loader`), 以及对所有 `.ts`文件使用 `ts-loader`:

```js
module.exports = {
    module: {
        rules: [
            { test: /\.css$/, use: 'css-loader' },
            { test: /\.tsx?$/, use: 'ts-loader' }
        ]
    }
}
```

## 5.2 使用 loader

有三种使用 loader 的方式:

- 配置 (推荐): 在 webpack.config.js 文件中指定 loader.
- 内联: 在每个 `import`语句中显式指定 loader.
- CLI: 在 shell 命令中指定它们.

### 5.2.1 配置 (Configuration)

`module.rules`允许你在 webpack 配置中指定多个 loader. 这是展示 loader 的一种简明方式, 并且有助于使代码变得简洁. 同时让你对各个 loader 有个全局概览.

```js
const config = {
    // ...
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true
                        }
                    }
                ]
            }
        ]
    }
};
```

### 5.2.2 内联

可以在 `import`语句或任何等效于"import"的方式中指定 loader. 使用 `!`将资源中的 loader 分开. 分开的每个部分都相对于当前目录解析.

```js
import Styles from 'style-loader!css-loader?modules!./styles.css';
```

通过前置所有规则及使用 `!`, 可以对应覆盖到配置中的任意 loader.

选项可以传递查询参数, 例如 `?key=value&foo=bar`, 或者一个 JSON 对象, 例如 `?{"key":"value", "foo":"bar"}`.

> 尽可能使用 `module.rules`. 因为这样可以减少源代码中的代码量, 并且可以在出错时, 更快地调试和定位 loader 中的问题.

### 5.2.3 CLI

通过 CLI 使用 loader:

```bash
webpack --module-bind jade-loader --module-bind 'css=style-loader!css-loader'
```

这会对 `.jade`文件使用 `jade-loader`, 对 `.css`文件使得 `style-loader`和 `css-loader`.

## 5.3 loader 特性

- loader 支持链式传递. 能够对资源使用流水线(pipeline). 一组链式的 loader 将按照相反的顺序执行. loader 链中的第一个 loader 返回值给下一个 loader. 在最后一个 loader, 返回 webpack 所预期的 JavaScript.
- loader 可以是同步的, 也可以是异步的.
- loader 运行在 Node.js 中, 并且能够执行任何可能的操作.
- loader 接收查询参数, 用于对 loader 传递配置.
- loader 也能够使用 `options`对象进行配置.
- 除了使用 `package.json`常见的 `main`属性, 还可以将普通的 npm 模块导出为 loader, 做法是在 `package.json`里定义一个 `loader`字段.
- 插件(plugin)可以为 loader 带来更多特性.
- loader 能够产生额外的任意文件.

loader 通过(loader)预处理函数, 为 JavaScript 生态系统提供了更多能力. 用户现在可以更加灵活地引入细粒度逻辑, 例如压缩, 打包, 语言翻译和其他更多.

## 5.4 解析 loader

loader 遵循标准的模块解析. 多数情况下, loader 将从模块路径(通常将模块路径认为是 `npm install`, `node_modules`)解析.

loader 模块需要导出为一个函数, 并且使用 Node.js 兼容的 JavaScript 编写. 通常使用 npm 进行管理, 但是也可以将自定义 loader 作为应用程序中的文件. 按照约定, loader 通常被命名为 `xxx-loader`(例如 `json-loader`).

# 6. 插件 (plugins)

插件是 webpack 的支柱功能. webpack 自身也是构建于, 在 webpack 配置中使用到的相同的插件系统之上的.

插件目的在于解决 loader 无法实现的其他事.

## 6.1 剖析

webpack 插件是有一个具有 `apply`属性的 JavaScript 对象. `apply`属性会被 webpack compiler 调用, 并且 compiler 对象可在整个编译生命周期访问.

```js
const pluginName = 'ConsoleLogOnuildWebpackPlugin';

class ConsoleLogOnBuildWebpackPlugin {
    apply(compiler) {
        compiler.hook.run.tap(pluginName, compilation => {
            console.log('webpack 构建过程开始!')
        });
    }
}
```

compiler hook 的 tap 方法的第一个参数, 应该是**驼峰式命名**的插件名称.

## 6.2 用法

由于插件可以携带参数/选项, 所以必须在 webpack 配置中, 向 `plugins`属性传入 `new`实例.

### 6.2.1 配置

```js
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装的插件
const webpack = require('webpack'); // 访问内置插件

const config = {
    // ...
    plugins: [
        new webpack.optimize.UglifyJsPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ]
};

module.exports = config;
```

### 6.2.2 Node API

```js
const webpack = require('webpack');
const configuration = require('./webpack.config.js');

const compiler = webpack(configuration);
compiler.apply(new webpack.ProgressPlugin());

compiler.run(function(err, stats) {});
```

> 即使使用 Node API , 仍然推荐在配置中传入 `plugins`属性. `compiler.apply`并不是推荐的使用方式.

# 7. 配置 (configuration)

webpack 的配置文件, 导出的是一个对象的 JavaScript 文件. webpack 会根据此对象定义的属性进行解析.

因为 webpack 配置是标准的 Node.js CommonJS 模块, 你可以做到以下事情:

- 通过 `require`导入其他文件.
- 通过 `require`使用 npm 的工具函数.
- 使用 JavaScript 控制流表达式, 例如 `?:`操作符.
- 对常用值使用常量或变量.
- 编写并执行函数来生成部分配置.

请在合适的时机使用这些特性.

虽然技术上可行, 但**应避免以下做法**:

- 在使用 webpack 命令行接口(CLI) (应该编写自己的命令行接口(CLI), 或使用 `--env`)时, 访问命令行接口(CLI)参数.
- 导出不确定的值 (调用 webpack 两次应该产生同样的输出文件).
- 编写很长的配置 (应该将配置拆分为多个文件).

> webpack 配置可以有很多种的格式和风格. 但为了团队所有人都能够理解和便于维护, 应该始终采取同一种用法, 格式和风格.

# 8. 模块 (modules) (注意此 modules 并非 loader 的 module)

在模块化编程中, 开发者将程序分解成离散功能块(discrete chunks of functionality), 并称之为模块.

每个模块具有比完整程序更小的接触面, 使得校验, 调试, 测试更简单. 精心编写的模块提供了可靠的抽象和封闭界限, 使得应用程序中每个模块都具有条理清楚的设计和明确的目的.

Node.js 从最一开始就支持模块化编程. 然而, 在 web 模块化的支持正缓慢到来. 在 web 中存在多种支持 JavaScript 模块化的工具, 这些工具各有优势和限制. webpack 基于从这些系统获得的经验教训, 并将模块的概念应用于项目中的任何文件.

## 8.1 什么是 webpack 模块

对比 Node.js 模块, webpack 模块能够以各种方式表达它们的依赖关系, 几个例子如下:

- ES2015 `import`语句
- CommonJS `require()`语句
- AMD `define`和 `require`语句
- css/sass/less 文件中的 `@import`语句
- 样式( `url(...)` )或 HTML 文件( `<img src=... />` )中的图片链接(image url)

## 8.2 支持的模块类型

webpack 通过 loader 可以支持各种语言和预处理器编写模块. loader 描述了 webpack 如何处理非 JavaScript(non-JavaScript)模块, 并且在 bundle 中引入这些依赖. webpack 社区已经为各种流行语言和语言处理器构建了 loader, 包括:

- CoffeeScript
- TypeScript
- ESNext (Babel)
- Sass
- Less
- Stylus

总的来说, webpack 提供了可定制的, 强大和丰富的 API, 允许任何技术栈使用 webpack, 保持了在你的开发, 测试和生成流程中无侵入性(non-opinionated).

# 9. 模块解析 (module resolution)

resolver 是一个库(library), 用于帮助找到模块的绝对路径. 一个模块可以作为另一个模块的依赖模块, 然后被后者引用. 如:

```js
import foo from 'path/to/module'
// 或者
require('path/to/module')
```

所依赖的模块可以是来自应用程序代码或第三方的库(library). resolver 帮助 webpack 找到 bundle 中需要引入的模块代码, 这些代码包含在每个 `require`/ `import`语句中. 当打包模块时, webpack 使用 enhanced-resolve 来解析文件路径.

## 9.1 webpack 中的解析规则

使用 `enhanced-resolve`, webpack 能够解析三种文件路径:

### 9.1.1 绝对路径

```js
import '/home/me/file';

import 'C:\\Users\\me\\file';
```

由于已经取得文件的绝对路径, 因此不需要进一步再做解析.

### 9.1.2 相对路径

```js
import '../src/file1';
import './file2';
```

在这种情况下, 使用 `import`或 `require`的资源文件(resource file)所在的目录被认为是上下文目录(context directory). 在 `import`/ `require`中给定的相对路径, 会添加此上下文路径(context path), 以产生模块的绝对路径(absolute path).

### 9.1.3 模块路径

```js
import 'module';
import 'module/lib/file';
```

模块将在 `resolve.modules`中指定的所有目录内搜索. 你可以替换初始模块路径, 此替换路径通过使用 `resolve.alias`配置选项来创建一个别名.

一旦根据上述规则解析路径后, 解析器(resolver)将检查路径是否指向文件或目录. 如果路径指向一个文件:

- 如果路径具有文件扩展名, 则直接将文件打包.
- 否则, 将使用 `resolve.extensions`选项作为文件扩展名来解析, 此选项告诉解析器在解析中能够接受哪些扩展名 (例如 .js, .jsx, .ts 等).

如果路径指向一个文件夹, 则采取以下步骤找到具有正确扩展名的正确文件:

- 如果文件夹中包含 `package.json`文件, 则按照顺序查找 `resolve.mainFiles`配置选项中指定的字段. 并且 `package.json`中的第一个这样的字段确定文件路径.
- 如果 `package.json`文件不存在或者文件中的 main 旁边段没有返回一个有效路径, 则按照顺序查找 `resolve.mainFiles`配置选项中指定的文件名, 看是否能找到一个匹配的文件名.
- 文件扩展名通过 `resolve.extensions`选项采用上述类似的方法进行解析.

## 9.2 解析 Loader (resolving loaders)

Loader 解析遵循与文件解析器指定的规则相同的规则. 但是 `resolveLoader`配置选项可以用来为 Loader 提供独立的解析规则.

## 9.3 缓存

每个文件系统访问都会被缓存, 以便更快触发对同一文件的多个并行或串行请求. 在观察模式下, 只有修改过的文件会从缓存中摘出. 如果关闭观察模式, 在每次编译前都会清理缓存.

# 10. 依赖图 (dependency graph)

任何时间, 一个文件依赖于另一个文件, webpack 就把此视为文件之间有依赖关系. 这使得 webpack 可以接收非代码资源(non-code asset) (例如图像或字体), 并且可以把它们作为依赖提供给你的应用程序.

webpack 从命令行或配置文件中定义的一个模块列表开始, 处理你的应用程序. 从这些入口起点开始, webpack 递归地构建一个依赖图, 这个依赖图包含着应用程序所需的每个模块, 然后将所有这些模块打包为少量的 bundle (通常只有一个) 并可由浏览器加载.

# 11. manifest

在使用 webpack 构建的典型应用程序或站点中, 有三种主要的代码类型:

1. 你或你的团队编写的源码.
2. 你的源码会依赖的任何第三方的 library 或 "vendor"代码.
3. webpack 的 runtime 和 manifest, 管理所有模块的交互.

## 11.1 runtime

指的是在浏览器运行时, webpack 用来连接模块化的应用程序的所有代码. runtime 包含: 在模块交互时, 连接模块所需的加载和解析逻辑. 包括浏览器中的已加载模块的连接, 以及懒加载模块的执行逻辑.

## 11.2 manifest

当使用 webpack 编译项目后, 其实 `/src`目录下的文件结构已经不存在了, 那么 webpack 是如何管理项目中所有模块之间的交互呢? 这就是 manifest 数据用途的由来.

当编译器(compiler)开始执行, 解析和映射应用程序时, 它会保留所有模块的详细要点. 这个数据集合称为 "Manifest", 当完成打包并发送到浏览器时, 会在运行时通过 Manifest 来解析和加载模块. 无论你原本使用的是哪些模块语法, 那些 `import` 或 `require`语句已经都转换为 `__webpack_require__`方法, 此方法指向模块标识符(module identifier). 通过使用 manifest 中的数据, runtime 将能够查询模块标识符, 检索出背后对应的模块.

## 11.3 问题

大多数情况下并不需要了解 runtime 做什么事情, 使用 manifest 来执行什么操作, 当应用程序加载到浏览器时, 所有内容将展现出魔幻般运行. 然而, 如果你决定通过使用浏览器缓存来改善项目的性能, 理解这一过程将突然变得尤为重要.

通过使用 bundle 计算出内容散列(content hash)作为文件名称, 这样在内容或文件修改时, 浏览中将通过新的内容散列指向新的文件, 从而使缓存无效. 一旦你开始这样做, 你会立即注意到一些有趣的行为. 即使表面上某些内容没有修改, 计算出的哈希还是会改变. 这是因为, runtime 和 manifest 的注入在每次构建都会发生变化.

# 12. 构建目标 (targets)

因为服务器和浏览器代码都可以用 JavaScript 编写, 所有 webpack 提供了多种构建目标(target).

> webpack 的 `target`属性不要和 `output.libraryTarget`属性混淆.

## 12.1 用法

要设置 `target`属性, 只需要在 webpack 配置中设置 target 值.

```js
module.exports = {
    target: 'node',
};
```

## 12.2 多个 Target

尽管 webpack 不支持向 `target`传入多个字符串, 但可以通过打包两份分离的配置来创建同构的库:

```js
const path = require('path');
const outputPath = path.resolve(__dirname, 'dist');
const serverConfig = {
    target: 'node',
    output: {
        path: outputPath,
        filename: 'lib.node.js'
    }
};
const clientConfig = {
    target: 'web',
    output: {
        path: outputPath,
        filename: 'lib.js'
    }
};
module.exports = [ serverConfig, clientConfig ];
```

# 13. 模块热替换 (hot module replacement)

模块热替换(HMR - Hot Module Replacement)功能会在应用程序运行过程中替换, 添加或删除模块, 而无需更新加载整个页面. 主要是通过以下几种方式, 来显著加快开发速度:

- 保留在完全重新加载页面时丢失的应用程序状态.
- 只更新变更内容, 以节省宝贵的开发时间.
- 调整样式更加快速 - 几乎相当于在浏览器调试器中更改样式.

## 13.1 这一切是如何运行的?

让我们从一些不同的角度观察, 以了解 HMR 的工作原理...

### 13.1.1 在应用程序中

通过以下步骤, 可以做到在应用程序中置换(swap in and out)模块:

1. 应用程序代码要求 HMR runtime 检查更新.
2. HMR runtime (异步) 下载更新, 然后通知应用程序代码.
3. 应用程序代码要求 HMR runtime 应用更新.
4. HMR runtime (同步) 应用更新.

### 13.1.2 在编译器中

除了普通资源, 编译器(compiler)需要发生 "update", 以允许更新之前的版本到新的版本. "update"由两部分组成:

1. 更新后的 manifest(JSON).
2. 一个或多个更新后的 chunk (JavaScript).

manifest 包含新的编译 hash 和所有的待更新 chunk 目录. 每个更新 chunk 都含有对应于此 chunk 的全部更新模块 (或一个 flag 用于表明此模块要被移除) 的代码.

编译器确保模块 ID 和 chunk ID 在这些构建之间保持一致. 通常将这些 ID 存储在内存中 (例如, 使用 webpack-dev-server 时), 但也可能将它们存储在一个 JSON 文件中.

### 13.1.3 在模块中

HMR 是可选功能, 只会影响包含 HMR 代码的模块. 举个例子, 通过 `style-loader`为 style 样式追加补丁. 为了运行追加补丁, `style-loader`实现了 HMR 接口; 当它通过 HMR 接收到更新, 它会使用新的样式替换旧的样式.

类似的, 当在一个模块中实现了 HMR 接口, 你可以描述出当模块被更新后发生了什么. 然而在多数情况下, 不需要强制在每个模块中写入 HMR 代码. 如果一个模块没有 HMR 处理函数, 更新就会冒泡(bubble up). 这意味着一个简单的处理函数能够对整人模块树(complete module tree)进行更新. 如果在这个模块树中, 一个单独的模块被更新了, 那么整组依赖模块都会被重新加载.

### 13.1.4 在 HMR Runtime 中

对于模块系统的 runtime, 附加的代码被发送到 `parents`和 `children`跟踪模块. 在管理方面, runtime 支持两个方法 `check`和 `apply`.

`check`发送 HTTP 请求来更新 manifest. 如果请求失败, 说明没有可用更新. 如果请求成功, 待更新 chunk 会和当前加载过的 chunk 进行比较. 对每个加载过的 chunk, 会下载相对应的待更新 chunk. 当所有待更新 chunk 完成下载, 就会准备切换到 `ready`状态.

`apply`方法将所有被更新模块标记为无效. 对于每个无效模块, 都需要在模块中有一个更新处理函数(update handler), 或者在它的父级模块们中有更新处理函数. 否则, 无效标记冒泡, 并也使父级无效. 每个冒泡继续, 直到到达应用程序入口起点, 或者到达带有更新处理函数的模块(以最先到达为准, 冒泡停止). 如果它从入口起点开始冒泡, 则此过程失败.

之后, 所有无效模块都被(通过 dispose 处理函数)处理和解除加载. 然后更新当前 hash, 并且调用所有 "accept" 处理函数. runtime 切换回闲置状态(idle state), 一切照常继续.