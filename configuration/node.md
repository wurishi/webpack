[link](https://www.webpackjs.com/configuration/)

# 1. 配置

webpack 是需要传入一个配置对象(configuration object). 取决于你如何使用 webpack, 可以通过两种方式之一: 终端或 Node.js.

[参考](./1/webpack.config.js)

# 2. 使用不同语言进行配置 (configuration languages)

webpack 接受以多种编程和数据语言编写的配置文件. 支持的文件扩展名列表, 可以在 node-interpret 包中找到. 使用 node-interpret, webpack 可以处理许多不同类型的配置文件.

## 2.1 TypeScript

为了使用 TypeScript 书写 webpack 的配置文件, 必须先安装相关依赖:

```bash
npm i -D typescript ts-node @types/node @types/webpack
```

webpack 版本 >= 2.7, 或者, 在 `tsconfig.json`文件中, 具有 `esModuleInterop`和 `allowSyntheticDefaultImports`这两个新的编译器选项的较新版本的 TypeScript.

### 问题

注意, 还需要核对 `tsconfig.json`文件. 如果 `tsconfig.json`中的 `compilerOptions`中的 module 字段是 `commonjs`, 则配置正确. 因为 `ts-node`仅支持 `commonjs`模块语法.

#### 解决方案一: 修改 tsconfig.json

打开 `tsconfig.json`文件并查找 `compilerOptions`. 将 `target`设置为 `"ES5"`, 以及将 `module`设置为 `"CommonJS"`(或者完全移除 `module`选项).

#### 解决方案二: 使用 tsconfig-paths

如果不能修改 `tsconfig.json`, 则可以安装 `tsconfig-paths`包:

```bash
npm i -D tsconfig-paths
```

然后, 为 webpack 专门创建一个单独的 TypeScript 配置:

tsconfig-for-webpack-config.json

```json
{
    "compilerOptions": {
        "module": "commonjs",
        "target": "es5"
    }
}
```

> `ts-node`可以使用 `tsconfig-path`提供的环境变量来解析 `tsconfig.json`文件

然后设置 `tsconfig-path`提供的环境变量 `process.env.TS_NODE_PROJECT`:

package.json

```json
{
    "scripts": {
        "build": "TS_NODE_PROJECT=\"tsconfig-for-webpack-config.json\" webpack"
    }
}
```

## 2.2 CoffeeScript

```bash
npm i -D coffee-script
```

## 2.3 Babel and JSX

首先安装依赖:

```bash
npm i -D babel-register jsxobj babel-preset-es2015
```

.babelrc

```json
{
    "presets": ["es2015"]
}
```

webpack.config.babel.js

```jsx
import jsxobj from 'jsxobj';

const CustomPlugin = config => ({
    ...config,
    name: 'custom-plugin'
});

export default (
	<webpack target="web" watch mode="production">
    	<entry path="src/index.js" />
        <resolve>
        	<alias {...{
                    react: 'preact-compat',
                    'react-dom': 'preact-compat'
                }} />
        </resolve>
        <plugins>
        	<uglify-js opts={{
                    compression: true,
                    mangle: false
                }} />
            <CustomPlugin foo="bar" />
        </plugins>
    </webpack>
)
```

> 如果你在其他地方也使用了 Babel 并且把 `模块(modules)`设置为了 `false`, 那么你要么同时维护两份单独的 `.babelrc`文件, 要么使用 `const jsxobj = require('jsxobj');` 并且使用 `module.exports`而不是新版本的 `import`和 `export`语法. 这是因为尽管 Node.js 已经支持了许多 ES6 的新特性, 然而还无法支持 ES6 模块语法.

# 3. 多种配置类型 (configuration types)

除了导出单个配置对象, 还有一些方式满足其他需求.

## 3.1 导出为一个函数

从 webpack 配置文件中导出一个函数. 该函数在调用时, 会传入两个参数.

- 环境对象(environment): 包含了相关 CLI 的环境选项. (具体请查看 CLI 文档的环境选项)
- 选项 map(argv): 描述了传递给 webpack 的选项, 并且具有 `output-filename`和 `optimize-minimize`等 key.

```js
module.exports = function (env, argv) {
  env = env || {};

  // argv['optimize-minimize'] === true 只有传入 -p 或 --optimize-minimize

  return {
    mode: env.production ? 'production' : 'development',
    devtool: env.production ? 'source-maps' : 'eval',
    entry: './index.js',
  };
};

```

## 3.2 导出一个 Promise

webpack 将运行由配置文件导出的函数, 并且等待 Promise 返回. 便于异步地加载所需的配置变量.

```js
module.exports = () => {
    return new Promise((resolve, reject) => {
        // ...
    })
}
```

## 3.3 导出多个配置对象

从 webpack 3.1.0 开始, 支持导出多个配置对象. webpack 会对所有的配置对象一一对应进行构建.

```js
module.exports = [
    {
        output: {
            filename: './dist-amd.js',
            libraryTarget: 'amd'
        }
    },
    {
        output: {
            filename:'./dist-commonjs.js',
            libraryTarget: 'commonjs'
        }
    }
]
```

# 4. 入口和上下文 (entry and context)

entry 对象是用于 webpack 查找启动并构建 bundle. 其上下文是入口文件所处的目录的绝对路径的字符串.

## 4.1 context

`string`

基础目录, 绝对路径, 用于从配置中解析入口起点 (entry point) 和 loader.

默认使用当前目录, 但是推荐在配置中传递一个值. 这使得你的配置独立于 CWD(current working directory)当前执行路径.

```js
context: path.resolve(__dirname, 'app')
```

## 4.2 entry

`string | [string] | object{<key>: string | [string]} | (function: () => string | [string] | object{<key>: string | [string]})`

起点或是应用程序的起点入口. 从这个起点开始, 应用程序启动执行. 如果传递一个数组, 那么数组的每一项都会执行.

动态加载的模块不是入口起点.

简单规则:

- 每个 HTML 页面都有一个入口起点.
- **单页应用(SPA)**: 一个入口起点.
- **多页应用(MPA)**: 多个入口起点.

```js
entry: {
    home: './home.js',
    about: './about.js',
    contact: './contact.js' 
}
```

## 4.3 命名

如果传入一个字符串或字符串数组, chunk 会被命为 `main`. 如果传入一个对象, 则每个键(key)会是 chunk 的名称, 该值描述了 chunk 的入口起点.

## 4.4 动态入口

```js
entry: () => './demo'
// 或
entry: () => new Promise(resolve => resolve(['./demo', './demo2']))
```

当结合 `output.library`选项时: 如果传入数组, 则只导出最后一项.

# 5. 输出 (output)

output 位于对象最顶级键(key), 包括了一组选项, 指示 webpack 如何去输出, 以及在哪里输出你的 bundle, asset 和其他你所打包或使用 webpack 载入的任何内容.

## 5.1 output.auxiliaryComment

`string | object`

在和 `output.library`和 `output.libraryTarget`一起使用时, 此选项允许用户向导出容器(export wrapper)中插入注释. 要为 `libraryTarget`每种类型都插入相同的注释, 可以直接将 `auxiliaryComment`设置为一个字符串:

```js
output: {
    library: 'comeLibName',
    libraryTarget: 'umd',
    filename: 'someLibName.js',
    auxiliaryComment: 'Test Comment'
}
```

将会生成如下:

```js
(function webpackUniversalModuleDefinition(root, factory) {
   // Test Comment
    if(typeof exports === 'object' && typeof module === 'object')
        module.exports = factory(require('lodash'));
    // Test Comment
    //...
});
```

要对 `libraryTarget`每种类型的注释进行更粒度地控制, 可以传入一个对象:

```js
auxiliaryComment: {
    root: 'Root Comment',
    commonjs: 'CommonJS Comment',
    commonjs2: 'CommonJS2 Comment',
    amd: 'AMD Comment'
}
```

## 5.2 output.filename

`string | function`

此选项决定了每个输出 bundle 的名称. 这些 bundle 将写入到 `output.path`选项指定的目录下.

对于单个入口起点, filename 会是一个静态名称.

```js
filename: 'bundle.js'
```

然而, 当通过多个入口起点(entry point), 代码拆分(code splitting)或各种插件(plugin)创建多个 bundle, 应该使用以下一种替换方式, 来赋予每个 bundle 一个唯一的名称.

- 使用入口名称

  ```js
  filename: '[name].bundle.js'
  ```

- 使用内部 chunk id

  ```js
  filename: '[id].bundle.js'
  ```

- 使用每次构建过程中, 唯一的 hash 生成

  ```js
  filename: '[name].[hash].bundle.js'
  ```

- 使用基于每个 chunk 内容的 hash

  ```js
  filename: '[chunkhash].bundle.js'
  ```

注意, 此选项被称为文件名, 但是你还是可以使用像 `"js/[name]/bundle.js"`这样的文件夹结构.

此选项不会影响那些 *按需加载 chunk* 的输出文件. 对于这些文件, 请使用 `output.chunkFilename`选项来控制输出. 通过 loader 创建的文件也不受影响. 在这种情况下, 你必须尝试 loader 特定的可用选项.

可以使用以下模板字符串 (通过 webpack 内容的 `TemplatedPathPlugin`):

| 模板        | 描述                                       |
| ----------- | ------------------------------------------ |
| [hash]      | 模块标识符 (module identifier) 的 hash     |
| [chunkhash] | chunk 内容的 hash                          |
| [name]      | 模块名称                                   |
| [id]        | 模块标识符 (module identifier)             |
| [query]     | 模块的 query, 例如, 文件名 `?`后面的字符串 |

`[hash]`和 `[chunkhash]`的长度可以使用 `[hash:16]`(默认为20)来指定. 或者, 通过指定 `output.hashDigestLength`的全局配置长度.

如果将这个选项设为一个函数, 函数将返回一个包含上面表格中替换信息的对象.

在使用 `ExtractTextWebpackPlugin`时, 可以用 `[contenthash]`来获取提取文件的 hash (即不是 `[hash]`也不是 `[chunkhash]`)

## 5.3 output.chunkFilename

`string | function`

此选项决定了非入口(non-entry) chunk 文件的名称. 有关可取的值的详细信息, 请查看 `output.filename`选项.

注意, 这些文件名需要在 runtime 根据 chunk 发送的请求去生成. 因此, 需要在 webpack runtime 输出 bundle 值时, 将 chunk id 的值对应映射到占位符(如 `[name]`和 `[chunkhash]`). 这会增加文件大小, 并且在任何 chunk 的占位符值修改后, 都会使 bundle 失效.

默认使用 `[id].js` 或从 `output.filename`中推断出的值 (`[name]`会被预先替换为 `[id]`或 `[id].`)

## 5.4 output.chunkLoadTimeout

`integer`

chunk 请示到期之间的毫秒数, 默认为 120000. 从 webpack 2.6.0 开始支持此选项.

## 5.5 output.crossOriginLoading

`boolean | string`

只用于 `target`是 `web`, 使用了通过 script 标签的 JSONP 来按需加载 chunk.

启用 `cross-origin 属性`加载 chunk. 以下是可以接收的值:

- `false`: 禁用跨域加载 (默认)
- `"anonymous"`: 不带凭据(credential)启用跨域加载
- `"use-credentials"`: 带凭据(credential)启用跨域加载 with credentials

## 5.6 output.jsonpScriptType

`string`

允许自定义 `script`的类型, webpack 会将 `script`标签注入到 DOM 中以下载异步 chunk, 可以使用以下选项:

- `"text/javascript"`: 默认
- `"module"`: 与 ES6 代码一起使用

## 5.7 output.devtoolModuleFilenameTemplate

`string | function(info)`

此选项仅在 `devtool`使用了需要模块名称的选项时使用.

自定义每个 source map 的 `sources`数组中使用的名称. 可以通过传递模板字符串(template string)或者函数来完成. 例如, 当使用 `devtool: 'eval'`, 默认值是:

```js
devtoolModuleFilenameTemplate: 'webpack://[namespace]/[resource-path]?[loaders]'
```

模板字符串(template string)接收以下替换 (通过 webpack 内部的 `ModuleFilenameHelpers`):

| 模板                     | 描述                                                         |
| ------------------------ | ------------------------------------------------------------ |
| [absolute-resource-path] | 绝对路径文件名                                               |
| [all-loaders]            | 自动和显式的 loader, 并且参数取决于第一个 loader 名称        |
| [hash]                   | 模块标识符的 hash                                            |
| [id]                     | 模块标识符                                                   |
| [loaders]                | 显式的 loader, 并且参数取决于第一个 loader 名称              |
| [resource]               | 用于解析文件的路径和用于第一个 loader 的任意查询参数         |
| [resource-path]          | 不带任何查询参数, 用于解析文件的路径                         |
| [namespace]              | 模块命名空间. 在构建成为一个 library 之后, 通常也是 library 名称, 否则为空 |

当使用一个函数时, 同样的选项要通过 `info`参数并使用驼峰式(camel-cased)访问:

```js
devtoolModuleFilenameTemplate: info => {
    return `webpack://${info.resourcePath}?${info.loaders}`
}
```

如果多个模块产生相同的名称, 使用 `output.devtoolFallbackModuleFilenameTemplate`来代替这些模块.

## 5.8 output.devtoolFallbackModuleFilenameTemplate

`string | function(info)`

当模块字符串或函数产生重复时使用的备用内容

## 5.9 ~~output.devtoolLineToLine~~

`boolean | object`

已废弃, 很快将删除.

## 5.10 output.devtoolNamespace

`string`

此选项确定 `output.devtoolModuleFilenameTemplate`使用的模块名称空间. 未指定时的默认值为: `output.library`. 在加载多个通过 webpack 构建的 library 时, 用于防止 sourcemap 中源文件路径冲突.

例如, 如果你有两个 library, 分别使用命名空间 `library1`和 `library2`, 并且都有一个文件 `./src/index.js` (可能具有不同的内容), 它们最终会被暴露为 `webpack://library1/./src/index.js`和 `webpack://library2/./src/index.js`

## 5.11 output.hashDigest

在生成 hash 时使用的编码方式, 默认为 `'hex'`. 支持 Node.js `hash.digest`的所有编码.

## 5.12 output.hashDigestLength

散列摘要的前缀长度, 默认为 20

## 5.13 output.hashFunction

`string | function`

散列算法, 默认为 `'md5'`. 支持 Node.js `crypto.createHash`的所有功能. 从 4.0.0-alpha2 开始, `hashFunction`支持返回一个自定义 hash 的构建函数. 出于性能原因, 你可以提供一个不加密的哈希函数 (non-crypto hash function)

```js
hashFunction: require('metrohash').MetroHash64
```

确保 hash 函数有可访问的 `update`和 `digest`方法.

## 5.14 output.hashSalt

可选值, 通过 Node.js 的 `hash.update`来更新哈希.

## 5.15 output.hotUpdateChunkFilename

`string | function`

自定义热更新 chunk 的文件名. 可选值的详细信息, 请查看 `output.filename`选项.

占位符只能是 `[id]`和 `[hash]`, 默认值是:

```js
hotUpdateChunkFilename: '[id].[hash].hot-update.js'
```

## 5.16 output.hotUpdateFunction

`function`

只在 `target`是 web 时使用, 用于加载热更新(hot update)的 JSONP 函数.

JSONP 函数用于异步加载(async load)热更新(hot-update) chunk.

详情可查看 `output.jsonpFunction`

## 5.17 output.hotUpdateMainFilename

`string | function`

自定义热更新的主文件名(main filename). 可选的值可参考 `output.filename`.

占位符只能是 `[hash]`, 默认值是:

```js
hotUpdateMainFilename: '[hash].hot-update.json'
```

## 5.18 output.jsonpFunction

`string`

只在 `target`是 web 时使用, 用于按需加载(load on-demand) chunk 的 JSONP 函数.

JSONP 函数用于异步加载(async load) chunk, 或者拼接多个初始 chunk(CommonsChunkPlugin, AggressiveSplittingPlugin).

如果在同一网页中使用了多个 (来自不同编译过程(compilation)的) webpack runtime, 则需要修改此选项.

如果使用了 `output.library`选项, library 名称会自动追加.

## 5.19 output.library

`string | object`

从 webpack 3.1.0 开始支持 object, 用于 `libraryTarget: "umd"`

`output.library`值的作用, 取决于 `output.libraryTarget`选项的值. 要注意的是, `output.libraryTarget`的默认选项是 `var`, 所以如果使用以下配置:

```js
output: {
    library: 'MyLibrary'
}
```

如果生成的输出文件, 是在 HTML 页面中作为一个 script 标签引入, 则变量 `MyLibrary`将与入口文件的返回值绑定.

注意, 如果将数组作为 entry, 那么只会暴露数组中的最后一个模块. 如果将对象作为 entry, 还可以使用数组暴露.

有关 `output.library`以及 `output.libraryTarget`详细信息, 请查看 *创建 library 指南*

## 5.20 output.libraryExport

`string | string[]`

webpack 3.0.0 开始支持 `string[]`

当使用 `libraryTarget`时, 默认情况下 webpack 会把 library 放到一个名为 `_entry_return_`的命名空间下, 它有以下取值:

- `libraryExport: "default"`: 默认情况下

  ```js
  // 假设导出名为 "MyDefaultModule"
  var MyDefaultModule = _entry_return_.default;
  ```

- `libraryExport: "MyModule"`: 

  ```js
  var MyModule = _entry_return_.MyModule;
  ```

- `libraryExport: ["MyModule", "MySubModule"]`: 

  ```js
  var MySubModule = _entry_return_.MyModule.MySubModule;
  ```

## 5.21 output.libraryTarget

`string`

默认值: `"var"`

配置如何暴露 library. 可以使用下面的选项中的任意一个. 注意, 此选项与分配给 `output.library`的值一同使用. 对于下面的示例, 都假定将 `output.library`的值配置为 `MyLibrary`

> 注意, 下面的示例代码中的 `_entry_return_`是入口起点返回的值. (参考 `output.libraryExport`)

### 暴露为一个变量

这些选项会将入口起点的返回值, 在 bundle 包所引入的位置, 赋值给 `output.library`提供的变量名.

#### `libraryTarget: "var"`

默认值. 当 library 加载完成, 入口起点的返回值将分配给一个变量:

```js
var MyLibrary = _entry_return_;

MyLibrary.doSomething();
```

**当使用此选项时, 如果将 `output.library`设置为空, 会因为没有变量导致无法赋值.**

#### `libraryTarget: "assign"`

将产生一个隐含的全局变量, 可能会潜在地重新分配到全局中已经存在的值(可能会覆盖全局变量, 所以要谨慎使用).

```js
MyLibrary = _entry_return_;
```

如果 `MyLibrary`在作用域中未在前面的代码中定义, 则 library 将被设置到全局作用域内.

**当使用此选项时, 如果将 `output.library`设置为空, 将产生一个破损的输出 bundle**

### 通过在对象上赋值暴露

这些选项将入口起点的返回值, 赋值给一个特定对象的属性 (此名称由 `output.library`定义)下.

**注意, 不设置 `output.library`将导致由入口起点返回的所有属性, 都会被赋值给给定的对象; 这里并不会检查现有的属性名是否存在.**

#### `libraryTarget: "this"`

入口起点的返回值将分配给 this 的一个属性(名称由 `output.library`定义).

```js
this['MyLibrary'] = _entry_return_;

this.MyLibrary.doSomething();
// 如果 this 是 window
MyLibrary.doSomething();
```

#### `libraryTarget: "window"`

入口起点的返回值将使用 `output.library`中定义的值, 分配给 `window`对象的这个属性下.

```js
window['MyLibrary'] = _entry_return_;
```

#### `libraryTarget: "global"`

入口起点的返回值将使用 `output.library`中定义的值, 分配给 `global`对象的这个属性下.

```js
global['MyLibrary'] = _entry_return_;
```

#### `libraryTarget: "commonjs"`

入口起点的返回值将使用 `output.library`中定义的值, 分配给 `exports`对象. 这个名称也意味着, 模块用于 CommonJS 环境.

```js
exports['MyLibrary'] = _entry_return_;

require('MyLibrary').doSomething();
```

### 模块定义系统

这些选项将导致 bundle 带有更完整的模块头部, 以确保与各种模块系统的兼容性. 根据 `output.libraryTarget`选项的不同, `output.library`选项将具有不同的含义.

#### `libraryTarget: "commonjs2"`

入口起点的返回值将分配给 `module.exports`对象. 这个名称也意味着模块用于 CommonJS 环境.

```js
module.exports = _entry_return_;

require('MyLibrary').doSomething();
```

注意, `output.library`会被省略不需要再设置.

#### `libraryTarget: "amd"`

将 library 暴露为 AMD 模块.

AMD 模块要求入口 chunk (例如使用 `<script>`标签加载的第一个脚本)通过特定的属性定义, 例如 `define`和 `require`, 它们通常由 RequireJS 或任何兼容的模块加载器提供 (例如 almond). 否则, 直接加载生成的 AMD bundle 将导致报错, 如 `define is not defined`.

所以, 使用以下配置:

```js
output: {
    library: 'MyLibrary',
    libraryTarget: 'amd'
}
```

生成的 output 将会使用 "MyLibrary" 作为模块名定义, 即

```js
define('MyLibrary', [], function() {
    return _entry_return_;
});
```

可以在 script 标签中, 将 bundle 作为一个模块整体引入, 并且可以像这样调用 bundle:

```js
require(['MyLibrary'], function(MyLibrary) {});
```

如果 `output.library`未定义, 将会生成以下内容.

```js
define([], function() {
    return _entry_return_;
});
```

如果直接加载 `<script>`标签, 此 bundle 无法按预期运行, 或者根本无法正常运行(在 almond loader 中). 只能通过文件的实际路径, 在 RequireJS 兼容的异步模块加载器中运行, 因此在这种情况下, 如果这些设置直接暴露在服务器, 那么 `output.path`和 `output.filename`对于这个特定的设置可能变得很重要.

#### `libraryTarget: "umd"`

将 library 暴露为所有的模块定义下都可运行的方式. 它将在 CommonJS, AMD 环境下运行, 或将模块导出到 global 下的变量.

所以使用以下配置:

```js
output: {
    library: 'MyLibrary',
    libraryTarget: 'umd'
}
```

最终输出如下:

```js
(function webpackUniversalModuleDefinition(root, factory) {
    if(typeof exports === 'object' && typeof module === 'object')
        module.exports = factory();
    else if(typeof define === 'function' && define.umd)
        define([], factory);
    else if(typeof exports === 'object')
        exports['MyLibrary'] = factory();
    else
        root['MyLibrary'] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
    return _entry_return_;
});
```

注意, 省略 `library`会导致将入口起点返回的所有属性, 直接赋值给 root 对象.

```js
output: {
    libraryTarget: 'umd'
}
```

输出结果如下:

```js
(function webpackUniversalModuleDefinition(root, factory) {
    if(typeof exports === 'object' && typeof module === 'object')
        module.exports = factory();
    else if(typeof define === 'function' && define.amd)
        define([], factory);
    else {
        var a = factory();
        for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
    }
})(typeof self !== 'undefined' ? self : this, function() {
    return _entry_return_;
});
```

从 webpack 3.1.0 开始, 可以将 `library`指定为一个对象, 用于给每个 target 起不同的名称.

```js
output: {
    library: {
        root: 'MyLibrary',
        amd: 'my-library',
        commonjs: 'my-common-library'
    },
    libraryTarget: 'umd'
}
```

### 其他 Targets

#### `libraryTarget: "jsonp"`

这将把入口起点的返回值, 包裹到一个 jsonp 包装容器中

```js
MyLibrary(_entry_return_);
```

你的 library 的依赖将由 `externals`配置定义.

## 5.22 output.path

`string`

output 目录对应一个绝对路径

```js
path: path.resolve(__dirname, 'dist/assets')
```

注意, `[hash]`在参数中被替换为编译过程(compilation)的 hash.

## 5.23 output.pathinfo

`boolean`

告诉 webpack 在 bundle 中引入所包含模块信息的相关注释. 此选项默认值是 `false`, 并且**不应该**用于生产环境(production), 但是对于阅读开发环境(development)中的生成代码(generated code)极其有用.

注意, 这些注释也会被添加至经过 tree shaking 后生成的 bundle 中.

## 5.24 output.publicPath

`string | function`

对于按需加载(on-demand-load)或加载外部资源(external resources) (如图片, 文件等)来说, output.publicPath 是很重要的选项. 如果指定了一个错误的值, 则在加载这些资源时会收到 404 错误.

此选项指定在浏览中所引用的此输出目录对应的**公开 URL**. 相对 URL(relative URL)会被相对于 HTML 页面 (或 <base> 标签)解析. 相对于服务的 URL(Server-relative URL), 相对于协议的 URL(protocol-relative URL)或绝对 URL(absolute URL)也可能被用到, 或者有时必须要用到, 例如: 当将资源托管到 CDN 时.

该选项的值是以 runtime(运行时) 或 loader(载入时)所创建的每个 URL 为前缀. 因此, 在多数情况下, **此选项的值都会以 / 结束**.

默认值是一个空字符串 `""`

示例:

```js
'https://cdn.example.com/assets/' // CDN(总是以 HTTPS 协议)
'//cdn.example.com/assets' // CDN (协议相同)
'/assets/' // 相对于服务(server-relative)
'assets/' // 相对于 HTML 页面
'../assets/' // 相对于 HTML 页面
'' // 相对于 HTML 页面(目录相同)
```

## 5.25 output.sourceMapFilename

`string`

此选项会向硬盘写入一个输出文件, 只在 `devtool`启用了 SourceMap 选项时才使用.

配置 source map 的命名方式, 默认使用 `"[file].map"`.

可以使用 `[name]`, `[id]`, `[hash]`和 `[chunkhash]`替换符号. 除此之外, 还可以使用以下替换符号.

| 模板       | 描述                                     |
| ---------- | ---------------------------------------- |
| [file]     | 模块文件名称                             |
| [filebase] | 模块 basename (Node.js 的 path.basename) |

建议**只使用 `[file]`占位符**, 因为其他占位符在非 chunk 文件(non-chunk files)生成的 SourceMap 时不起作用.

## 5.26 output.sourcePrefix

`string`

修改输出 bundle 中每行的前缀.

```js
sourcePrefix: '\t'
```

注意, 默认情况下使用空字符串. 使用一些缩进会看起来更美观, 但是可能导致多行字符串出现问题.

## 5.27 output.strictModuleExceptionHandling

`boolean`

如果一个模块是在 `require`时抛出异常, 告诉 webpack 从模块实例缓存(`require.cache`)中删除这个模块.

出于性能原因, 默认为 `false`.

当设置为 `false`时, 该模块不会从缓存中删除, 这将造成仅在第一次 `require`调用时抛出异常(会导致与 node.js 不兼容).

例如, 有一个 `module.js`

```js
throw new Error('error');
```

```js
// 当 strictModuleExceptionHandling = false
require('module') // 抛出错误
require('module') // 不抛出错误
```

```js
// 当 strictModuleExceptionHandling = true
require('module') // 抛出错误
require('module') // 仍然抛出错误
```

## 5.28 output.umdNamedDefine

`boolean`

当使用了 `libraryTarget: "umd"`时, 设置

```js
umdNamedDefine: true
```

会对 UMD 的构建过程中的 AMD 模块进行命名. 否则就使用匿名的 `define`.

# 6. 模块 (module)

这些选项决定了如何处理项目中的不同类型的模块.

## 6.1 module.noParse

`RegExp | [RegExp] | function`

从 webpack3.0.0 开始支持 `function`

防止 webpack 解析那些任何与给定正则表达式相匹配的文件. 忽略的文件中不应该含有 `import`, `require`, `define`的调用, 或任何其他导入机制. 忽略大型的 library 可以提高构建性能.

```js
npParse: /jquery|lodash/

// 从 webpack 3.0.0 开始
noParse: function(content) {
    return /jquery|lodash/.test(content);
}
```

## 6.2 module.rules

`array<Rule>`

创建模块时, 匹配请求的规则数组. 这些规则能够修改模块的创建方式. 这些规则能够对模块(module)应用 loader, 或者修改解析器(parser).

## 6.3 Rule

每个规则可以分为三部分 - 条件(condition), 结果(result)和嵌套规则(nested rule).

### Rule 条件

条件有两种输入值:

1. resource: 请求文件的绝对路径.
2. issuer: 被请求资源(requested the resource)的模块文件的绝对路径. 是导入时的位置.

例如: 从 `app.js`导入 `./style.css`, resource 是 `/path/to/style.css`, issuer 是 `/path/to/app.js`.

在规则中, 属性 `test`, `include`, `exclude`和 `resource`对 resource 匹配. 属性 `issuer`对 issuer 匹配.

当使用多个条件时, 所有条件都需要匹配.

### Rule 结果

规则结果只在规则条件匹配时使用.

规则有两种输入值:

1. 应用的 loader: 应用在 resource 上的 loader 数组.
2. Parse 选项: 用于为模块创建解析器的选项对象.

这些属性会影响 loader: `loader`, `options`, `use`.

也兼容这些属性: `query`, `loaders`.

`enforce`属性会影响 loader 开头的. 不论是普通的, 前置的, 后置的 loader.

`parser`属性会影响 parser 选项.

### 嵌套的 Rule

可以使用属性 `rules`和 `oneOf`指定嵌套规则.

这些规则用于在规则条件(rule condition)匹配时进行取值.

## 6.4 Rule.enforce

可能的值有: `"pre"` | `"post"`

指定 loader 种类. 没有值表示是普通的 loader.

还有一个额外的种类"行内 loader", loader 被应用在 import/require 行内.

所有 loader 通过 `前置 -> 行内 -> 普通 -> 后置`排序, 并按此顺序使用.

所有普通 loader 可以通过在请求中加上 `|`前缀来忽略(覆盖).

所有普通和前置 loader 可以通过在请求中加上 `-!`前缀来忽略(覆盖).

所有普通, 后置和前置 loader 可以通过在请求中加上 `!!`前缀来忽略(覆盖).

不应该使用行内 loader 和 `!`前缀, 因为它们是非标准的. 它们可在由 loader 生成的代码中使用.

## 6.5 Rule.exclude

`Rule.exclude`是 `Rule.resource.exclude`的简写. 如果提供了 `Rule.exclude`选项, 就不能再提供 `Rule.resource`.

## 6.6 Rule.include

`Rule.include`是 `Rule.source.include`的简写. 如果提供了 `Rule.include`选项, 就不能再提供 `Rule.resource`.

## 6.7 Rule.issuer

一个<!--条件-->, 用来与被发布的 request 对应的模块项匹配. 在以下示例中, a.js request 的 `发布者(issuer)`是 index.js 文件的路径.

index.js

```js
import A from './a.js'
```

这个选项可以用来将 loader 应用到一个特定模块或一组模块的依赖中.

## 6.8 Rule.loader

`Rule.loader`是 `Rule.use:[ {loader} ]`的简写.

## ~~6.9 Rule.loaders~~

是 `Rule.use`的别名, 但已被标识为废弃.

## 6.10 Rule.oneOf

规则数组, 当规则匹配时, 只使用第一个匹配规则.

```js
{
    test: /.css$/,
    oneOf: [
        {
            resourceQuery: /inline/, // foo.css?inline
            use: 'url-loader'
        },
        {
            resourceQuery: /external/, // foo.css?external
            use: 'file-loader'
        }
    ]
}
```

## ~~6.11 Rule.options / Rule.query~~

它们是 `Rule.use: [ { options } ]`的简写, 已废弃.

## 6.12 Rule.parser

解析选项对象. 所有应用的解析选项都将被合并.

解析器(parser)可以查阅这些选项, 并相应地禁用或重新配置. 大多数默认插件, 会如下解析值:

- 将选项设置为 `false`, 将禁用解析器.
- 将选项设置为 `true`, 或不修改将其保留为 `undefined`, 可以启用解析器.

然而, 一些解析器(parser)插件可能不光只接收一个布尔值. 例如, 内部的 `NodeStuffPlugin`, 可以接收一个对象, 而不是 `true`, 来为特定的规则添加额外的选项.

示例 (默认的插件解析器选项):

```js
parser: {
    amd: false, // 禁用 AMD
    commonjs: false, // 禁用 CommonJS
    system: false, // 禁用 SystemJS
    harmony: false, // 禁用 ES2015 Harmony import/export
    requireInclude: false, // 禁用 require.include
    requireEnsure: false, // 禁用 require.ensure
    requireContext: false, // 禁用 require.context
    browserify: false, // 禁用特殊处理的 browserify bundle
    requireJs: false, // 禁用 requirejs.*
    node: false, // 禁用 __dirname, __filename, module, require.extensions, require.main 等.
    node: {...}, // 在模块级别(module level)上重新配置 node 层(layer)
}
```

## 6.13 Rule.resource

<!--条件-->会匹配 resource. 既可以提供 `Rule.resource`选项, 也可以使用快捷选项 `Rule.test`, `Rule.exclude`和 `Rule.include`.

## 6.14 Rule.resourceQuery

<!--条件-->用来匹配 query, 如 `import foo from './foo.css?inline'`匹配的是:

```js
{
    test: /.css$/,
    resourceQuery: /inline/,
    use: 'url-loader'
}
```

## 6.15 Rule.rules

规则数组

## 6.16 Rule.test

`Rule.test`是 `Rule.resource.test`的简写. 如果提供了一个 `Rule.test`选项, 就不能再提供 `Rule.resource`

## 6.17 Rule.use

应用于模块的 <!--UseEntity--> 列表. 每个入口(entry)指定使用一个 loader.

传递字符串 (如 `use: ['style-loader']`) 是 loader 属性的简写方式 (`use: [ { loader: 'style-loader' } ]`)

当使用数组传递多个 loader 时, 将会按从右到左的顺序执行. (即最后一条配置最先执行).

## 6.18 <!--条件-->

条件可以是这些之一:

- 字符串: 匹配输入必须以提供的字符串开始.
- 正则表达式: test 输入值.
- 函数: 调用输入的函数, 必须返回一个真值(truthy value)以匹配.
- 条件数组: 至少一个匹配条件.
- 对象: 匹配所有属性. 每个属性都有一个定义好的行为.
  - `{ test: Condition }`: 匹配特定条件. 一般提供一个正则表达式或正则表达式的数组.
  - `{ include: Condition }`: 匹配特定条件. 一般提供一个字符串或者字符串数组.
  - `{ exclude: Condition }`: 排队特定条件. 一般是一个字符串或字符串数组.
  - `{ and: [Condition] }`: 必须匹配数组中的所有条件.
  - `{ or: [Condition] }`: 匹配数组中的任何一个条件.
  - `{ not: [Condition] }`: 必须排队这个条件.

## 6.19 <!--UseEntry-->

`object`

必须有一个 `loader`属性是字符串. 它使用 loader 解析选项(resolveLoader), 相对于配置中的 `context`来解析.

可以有一个 `options`属性为字符串或对象. 值可以传递到 loader 中, 可以将其理解为 loader 选项.

由于兼容性原因, 也可能有 `query`属性, 它是 `options`属性的别名.

## ~~6.20 模块上下文~~

已被废弃

# 7. 解析 (resolve)

这些选项能设置模块如何被解析.

## 7.1 resolve

`object`

配置模块如何解析. 例如, 当在 ES2015 中调用 `import 'lodash'`, `resolve`选项能够对 webpack 查找 `"lodash"`的方式去做修改.

## 7.2 resolve.alias

`object`

创建 `import`和 `require`的别名, 来确保模块引入变得更简单.

例如:

```js
alias: {
    Utilities: path.resolve(__dirname, 'src/utilities/'),
    Templates: path.resolve(__dirname, 'src/templates/')
}
```

```js
import Utility from '../../utilities/utility';
// 上面这种可以使用别名导入
import Utility from 'Utilities/utility';
```

也可以在给定对象的键后的未尾添加 `$`, 以表示精准匹配:

```js
alias: {
    xyz$: path.resolve(__dirname, 'path/to/file.js')
}
```

这将产生以下结果:

```js
import Test1 from 'xyz'; // 精确匹配, 将导入 path/to/file.js
import Test2 from 'xyz/file.js'; // 非精确匹配, 触发普通解析
```

| 别名                           | import "xyz"                        | import "xyz/file.js"              |
| ------------------------------ | ----------------------------------- | --------------------------------- |
| {}                             | /abc/node_modules/xyz/index.js      | /abc/node_modules/xyz/file.js     |
| {xyz: '/abs/path/to/file.js'}  | /abc/path/to/file.js                | error                             |
| {xyz$: '/abs/path/to/file.js'} | /abc/path/to/file.js                | /abc/node_modules/xyz/file.js     |
| {xyz: './dir/file.js'}         | /abc/dir/file.js                    | error                             |
| {xyz$: './dir/file.js'}        | /abc/dir/file.js                    | /abc/node_modules/xyz/file.js     |
| {xyz: '/some/dir'}             | /some/dir/index.js                  | /some/dir/file.js                 |
| {xyz$: '/some/dir'}            | /some/dir/index.js                  | /abc/node_module/xyz/file.js      |
| {xyz: './dir'}                 | /abc/dir/index.js                   | /abc/dir/file.js                  |
| {xyz: 'modu'}                  | /abc/node_module/modu/index.js      | /abc/node_modules/modu/file.js    |
| {xyz$: 'modu'}                 | /abc/node_module/modu/index.js      | /abc/node_module/xyz/file.js      |
| {xyz: 'modu/some/file.js'}     | /abc/node_modules/modu/some/file.js | error                             |
| {xyz: 'modu/dir'}              | /abc/node_module/modu/dir/index.js  | /abc/node_modules/dir/file.js     |
| {xyz: 'xyz/dir'}               | /abc/node_module/xyz/dir/index.js   | /abc/node_modules/xyz/dir/file.js |
| {xyz$: 'xyz/dir'}              | /abc/node_module/xyz/dir/index.js   | /abc/node_modules/xyz/file.js     |

要注意, 如果在 package.json 文件中有过配置, index.js 也可能是解析到另一个文件上.

/abc/node_modules 也可能会在 /node_modules 中解析.

## 7.3 resolve.aliasFields

`string`

指定一个字段, 例如 `browser`, 进行解析.

## 7.4 resolve.cacheWithContext

`boolean`(从 webpack 3.1.0 开始)

如果启用了不安全缓存, 请在缓存键(cache key)中引入 `request.context`. 这个选项被 `enhanced-resolve`模块考虑在内. 从 webpack 3.1.0 开始, 在配置了 `resolve`或 `resolveLoader`插件时, 解析缓存(resolve caching)中的上下文(context)会被忽略. 这个选项用来解决性能衰退的问题.

## 7.5 resolve.descriptionFiles

`array`

用于描述的 JSON 文件. 默认:

```js
descriptionFiles: ['package.json']
```

## 7.6 resolve.enforceExtension

`boolean`

如果是 `true`, 将不允许无扩展名(extension-less)文件. 默认如果 `./foo`有 `.js`扩展, `require('./foo')`可以正常运行. 但如果设置此选项为 `true`, 只有 `require('./foo.js')`才能够正常工作.

## 7.7 resolve.enforceModuleExtension

`boolean`

对模块是否需要使用扩展(例如 loader), 默认为 false.

## 7.8 resolve.extensions

`array`

自动解析确定的扩展, 默认值为:

```js
extensions: ['.js', '.json']
```

> 注意, 使用此选项时, 会覆盖默认数组. 也就是说 webpack 将不再尝试使用默认扩展来解析模块. 对于使用了扩展名导入的模块, 如 `import someFile from './somefile.ext'`, 要想正确的解析, 需要有一个 `"*"`字符串选项包含中数组中.

## 7.9 resolve.mainFields

`array`

当从 npm 包中导入模块时 (如 `import * as D3 from 'd3'`), 此选项将决定在 `package.json`中使用哪个字段导入模块. 根据 webpack 配置中指定的 `target`不同, 默认值也会有所不同.

当 `target`属性设置为 `webworker`, `web`或者没有指定时, 默认值为:

```js
mainFields: ['browser', 'module', 'main']
```

对于其他任意的 `target`(包括 `node`), 默认值为:

```js
mainFields: ['module', 'main']
```

如果 D3 的 `package.json`含有这些字段:

```json
{
    "main": "build/d3.Node.js",
    "browser": "build/d3.js",
    "module": "index",
}
```

这意味着 `import * as D3 from 'd3'`, 实际上是从 `browser`属性解析文件, 因为 `browser`属性是最优先选择.

## 7.10 resolve.mainFiles

`array`

解析目录时要使用的文件名, 默认:

```js
mainFiles: ['index']
```

## 7.11 resolve.modules

`array`

告诉 webpack 解析模块时应该搜索的目录.

绝对路径和相对路径都能使用, 但是要知道它们之间存在一些差异.

相对路径将类似于 Node 查找 'node_modules'的方式一样, 如果当前目录下没有找到, 将会一级级的往父级目录查找.

绝对路径, 将只在给定的目录中搜索.

## 7.12 resolve.unsafeCache

`regex | array | boolean`

如果启用, 会主动缓存模块, 但并不安全. 默认

```js
unsafeCache: true
```

如果只想缓存 utilities 模块, 可以使用正则表达式或正则数组.

```js
unsafeCache: /src\/utilities/
```

## 7.13 resolve.plugins

使用额外的解析插件列表.

## 7.14 resolve.symlinks

`boolean`

是否将符号连接(symlink)解析到它们的符号链接位置(symlink location). 默认 true.

启用时, 符号链接(symlink)的资源, 将解析为其真实的路径, 而不是其符号链接(symlink)位置. 注意, 当使用符号链接 package 包工具时(如 `npm link`), 可能会导致模块解析失败.

## 7.15 resolve.cachePredicate

`function`

决定请求是否应该被缓存的函数. 函数传入一个带有 `path`和 `request`属性的对象. 默认为:

```js
cachePredicate: function() { return true; }
```

## 7.16 resolveLoader

`object`

这组选项与上的 `resolve`对象的属性集合相同, 但仅用于解析 webpack 的 loader 包.

## 7.17 resolveLoader.moduleExtensions

`array`

解析 loader 时, 用到扩展名(extensions)/后缀(suffixes). 从 webpack 2 开始, 强烈建议使用全名, 以尽可能的清晰. 但如果确实想将 `example-loader`省略为 `example`, 则可以使用此选项来实现:

```js
moduleExtensions: ['-loader']
```

# 8. 插件 (plugins)

## 8.1 plugins

`array`

该选项用于以各种方式自定义 webpack 构建过程. 

# 9. 开发中 Server (devServer)

webpack-dev-server 能够用于快速开发应用程序.

与 webpack-dev-middleware 兼容的选项旁边有 *🔑*

## 9.1 devServer

`object`

通过来自 webpack-dev-server 的这些选项, 能够用多种方式改变其行为.

如果使用 Node.js API 来使用 dev-server, `devServer`中和选项将被忽略.

## 9.2 devServer.after

`function`

使用 middleware 启动 devServer 后.

## 9.3 devServer.allowedHosts

`array`

允许访问 devServer 的白名单.

## 9.4 devServer.before

`function`

使用 middleware 启动 devServer 前.

## 9.5 devServer.bonjour

## 9.6 devServer.clientLogLevel

`string`

可能的值有 `none`, `error`, `warning`或者 `info`(默认值)

## 9.7 devServer.color - CLI only

`boolean`

是否在控制台启用颜色.

## 9.8 devServer.compress

`boolean`

服务是否启用 gzip 压缩

## 9.9 devServer.contentBase

`boolean | string | array`

告诉服务器从哪里提供静态文件内容. 

## 9.10 devServer.disableHostCheck

`boolean`

## 9.11 devServer.filename *🔑*

`string`

只有在**惰性模式**中有效. 默认在惰性模式中, 每个请求结果都会产生全新的编译. 使用 `filename`, 可以只在某个文件被请求时编译.

## 9.12 devServer.headers *🔑*

`object`

在所有响应中添加 head 内容.

## 9.13 devServer.historyApiFallback

`boolean | object`

当使用 H5 History API 时, 任意的 `404`响应都可能需要被替代为 `index.html`, 可以传入以下启用:

```js
historyApiFallback: true
```

通过传入一个对象, 比如使用 `rewrites`这个选项, 可以对此行为做进一步控制:

```js
historyApiFallback: {
    rewrites: {
        { from: /^\/$/, to: '/views/landing.html' },
        { from: /^\/subpage/, to: '/views/subpage.html' },
        { from: /./, to: '/views/404.html' }
    }
}
```

当路径中使用点(dot) (常见于 Angular), 可能需要使用 `disableDotRule`

## 9.14 devServer.host

`string`

指定使用一个 host, 默认是 localhost.

## 9.15 devServer.hot

`boolean`

启用 webpack 的模块热替换特性.

## 9.16 devServer.hotOnly

`boolean`

## 9.17 devServer.https

`boolean | true`

设置为 true, 表示 dev-server 通过 HTTPS 的 HTTP/2 提供服务.

也可以提供自己的签名证书:

```js
https: {
    key: fs.readFileSync('/path/to/server.key'),
    cert: fs.readFileSync('/path/to/server.crt'),
    ca: fs.readFileSync('/path/to/ca.pem')
}
```

## 9.18 devServer.index

`string`

指定 index 文件的文件名

## 9.19 devServer.info - CLI only

`boolean`

## 9.20 devServer.inline

`boolean`

在 dev-server 的两种不同模式之间切换. 默认情况下, 使用内联模式(inline mode), 这意味着一段处理实际重载的脚本会被插入到 bundle 中, 并且构建消息将会出现在浏览器控制台.

也可以使用 iframe 模式 (设置为 false), 它会在通知栏下面使用 <iframe> 标签, 其中包含了关于构建的消息.

> 推荐使用模块热替换的内联模式, 因为它包含来自 websocket 的 HMR 触发器. 轮询模式可以作为替代方案, 但需要一个额外的入口点. `'webpack/hot/poll?1000'`

## 9.21 devServer.lazy *🔑*

`boolean`

当启用 `lazy`时, dev-server 只有在请求时才编译包 (bundle). 这意味着 webpack 不会监视任何文件改动. 这称为 **惰性模式**

## 9.22 devServer.noInfo *🔑*

`boolean`

启用后, 部分消息会被隐藏(如, 启动时和每次保存之后, 显示的 webpack 包(bundle)信息). 错误和警告仍然会显示.

## 9.23 devServer.open

`boolean`

设置为 true 时, 每次启动 dev-server 会打开浏览器.

默认打开的是默认浏览器, 也可以指定

```bash
webpack-dev-server --open 'Google Chrome'
```

## 9.24 devServer.openPage

`string`

当浏览器自动打开时指向的页面路径.

## 9.25 devServer.overlay

`boolean | object`

是否在浏览器中全屏显示编译错误和警告.

传入对象, 可以精细控制错误和警告:

```js
overlay: {
    warnings: true,
    errors: true
}
```

## 9.25 devServer.pfx

`string`

指定 SSL 的.pfx 文件.

## 9.26 devServer.pfxPassphrase

`string`

## 9.27 devServer.port

`number`

指定要监听请示的端口号.

## 9.28 devServer.proxy

`object`

dev-server 使用了 `http-proxy-middleware`包处理代理.

```js
proxy: {
    '/api': 'http://localhost:3000'
}
// 请求 /api/users 会被代理请求到 http://localhost:3000/api/users

// 如果不想传递 /api
proxy: {
    '/api': {
        target: 'http://localhost:3000',
        pathRewrite: {'^/api': ''}
    }
}
```

如果不想代理所有的请求, 可以基于一个函数的返回值绕过代理. 必须返回 `false`或路径, 来跳过代理请示.

```js
proxy: {
    '/api': {
        target: 'http://localhost:3000',
        bypass: function(req, res, proxyOptions) {
            if(req.headers.accept.indexOf('html') !== -1) {
                console.log('跳过代理');
                return '/index.html'
            }
        }
    }
}
```

## 9.29 devServer.progress - CLI only

`boolean`

将运行进度输出到控制台.

## 9.30 devServer.public

`boolean`

当使用 内联模式(inline mode)并代理 dev-server 时, 内联的客户端脚本并不总是知道要连接到什么地方. 它会尝试根据 `window.location`来猜测服务器的 URL, 但是如果失败, 你需要这样:

```js
public: 'myapp.test:80' // 让 dev-server 代理到 nginx 的 myapp.test 上
```

## 9.31 devServer.publicPath *🔑*

`string`

此路径下的打包文件可以在浏览器中访问.

> 请确保 publicPath 总是以斜杠(/)开头和结尾.
>
> 也可以使用一个完整的 URL

## 9.32 devServer.quiet *🔑*

`boolean`

启用后, 除了初始启动信息之外的任何内容都不会被打印到控制台.(包括错误和警告)

## ~~9.33 devServer.setup~~

`function`

webpack 3.0.0 开始废弃, 请使用 `devServer.before`

## 9.34 devServer.socket

`string`

## 9.35 devServer.staticOptions

只有在 `contentBase`被设置时才有效.

## 9.36 devServer.stats *🔑*

`string | object`

控制输出信息. 当使用了 `quiet`或 `noInfo`之后无效.

## 9.37 devServer.stdin - CLI only

`boolean`

当接收到 stdin ends 时是否关闭 dev server.

## 9.38 devServer.useLocalIp

`boolean`

浏览器打开时是否使用本地 IP.

## 9.39 devServer.watchContentBase

`boolean`

是否让服务器观察到 `devServer.contentBase`目录中的文件被修改时触发页面 reload. 默认为 false.

## 9.40 devServer.watchOptions *🔑*

`object`

webpack 默认情况下使用文件系统(file system)获取文件改动的通知. 但在某些情况下, 可能不能正常工作. (例如使用 Network File System(NFS)时). 这时, 可以改为轮询模式:

```js
watchOptions: {
    poll: true
}
```

如果轮询对文件系统来说太频繁的话, 可以修改间隔时间(毫秒为单位), 将其设置为一个整数.

# 10. devtool

此选项控制是否生成, 以及如何生成 source map.

使用 `SourceMapDevToolPlugin`进行更细粒度的配置.

使用 `source-map-loader`来处理已有的 source map.

## 10.1 devtool

`string | false`

选择一种 source map 格式来增强调试过程. 不同的值会明显影响到构建(build)和重新构建(rebuild)的速度.

> 可以直接使用 `SourceMapDevToolPlugin`/ `EvalSourceMapDevToolPlugin`来替代使用 `devtool`选项.
>
> 但**两者切勿同时使用**, 因为在 `devtool`选项内部添加过这些插件, 同时使用意味着应用两次插件.

| devtool                        | 构建速度 | 重新构建速度 | 生产环境 | 品质(quality)        |
| ------------------------------ | -------- | ------------ | -------- | -------------------- |
| (none)                         | +++      | +++          | yes      | 打包后的代码         |
| eval                           | +++      | +++          | no       | 生成后的代码         |
| cheap-eval-source-map          | +        | ++           | no       | 转换过的代码(仅限行) |
| cheap-module-eval-source-map   | o        | ++           | no       | 原始源代码(仅限行)   |
| eval-source-map                | --       | +            | no       | 原始源代码           |
| cheap-source-map               | +        | o            | no       | 转换过的代码(仅限行) |
| cheap-module-source-map        | o        | -            | no       | 原始源代码(仅限行)   |
| inline-cheap-source-map        | +        | o            | no       | 转换过的代码(仅限行) |
| inline-cheap-module-source-map | o        | -            | no       | 原始源代码(仅限行)   |
| source-map                     | --       | --           | yes      | 原始源代码           |
| inline-source-map              | --       | --           | no       | 原始源代码           |
| hidden-source-map              | --       | --           | yes      | 原始源代码           |
| nosources-source-map           | --       | --           | yes      | 无源代码内容         |

> `+++` 非常快速
>
> `++` 快速
>
> `+` 比较快
>
> `o` 中等
>
> `-` 比较慢
>
> `--` 慢

## 10.2 品质说明 (quality)

- 打包后的代码: 将所有生成的代码视为一大块代码, 将看不到相互分离的模块.
- 生成后的代码: 每个模块相互分离, 并用模块名称进行注释. 可以看到 webpack 生成的代码.
- 转换后的代码: 每个模块相互分离, 并用模块名称进行注释. 可以看到 webpack 转换前, loader 转译后的代码.
- 原始源代码: 每个模块相互分离, 并用模块名称进行注释. 会看到转译之前的代码.
- 无源代码内容: source map 中不包含源代码内容. 浏览器通常会尝试从 web 服务器或文件系统加载源代码. 你必须确保正确设置 `output.devtoolModuleFilenameTemplate`, 以匹配源代码的 url.
- (仅限行): source map 被简化为每行一个映射. 这意味着每个语句只有一个映射. 这会妨碍到在语句级别上进行的调试, 也会妨碍在每行的一些列上设置断点.

## 10.3 对于开发环境

以下选项适合开发环境:

- eval: 每个模块都使用 `eval()`执行, 并且都有 `//@ sourceURL`. 此选项会非常快地构建, 主要的缺点是, 由于会映射到转换后的代码, 而不是原始代码, 所以不能正确的显示行数.
- eval-source-map: 每个模块使用 `eval()`执行, 并且 source map 转换为 DataUrl 后添加到 `eval()`中. 初始化 source map 时比较慢, 但是会在重新构建时提供比较快的速度, 并且生成实际的文件. 行数能够正确映射, 因此它是开发环境下最佳品质的 source map.
- cheap-eval-source-map: 类似 eval-source-map, 每个模块使用 `eval()`执行. 这是 "cheap(低开销)"的 source map, 因为它没有生成列映射(column mapping), 只是映射行数.
- cheap-module-eval-source-map: 类似 cheap-eval-source-map, 并且在这种情况下, 源自 loader 的 source map 会得到更好的处理结果. 但是 loader source map 会被简化为每行一个映射.

## 10.4 特定场景

以下选项仅在一些特定场景下需要, 例如, 针对一些第三方工具.

- inline-source-map: source map 转换为 DataUrl 后添加到 bundle 中.
- cheap-source-map: 没有列映射的 source map.
- inline-cheap-source-map: 类似 chap-source-map, 但是 source map 会转换为 DataUrl 后添加到 bundle 中.
- cheap-module-source-map: 没有列映射的 source map, 并将 loader source map 简化为每行一个映射.
- inline-cheap-module-source-map: 类似 cheap-module-source-map, 但是 source map 转换为 DataUrl 添加到 bundle 中.

## 10.5 对于生产环境

以下选项通常用于生产环境中:

- (none): 省略 `devtool`选项, 不生成 source map.

- source-map: 整个 source map 作为一个单独的文件生成. 它为 bundle 添加了一个引用注释, 以便开发工具知道在哪里可以找到它.

  > 你应该将你的服务器配置为, 不允许普通用户访问 source map 文件!

- hidden-source-map: 与 source-map 相同, 但不会为 bundle 添加引用注释. 如果你只想 source map 映射那些源自错误报告的错误堆栈跟踪信息, 但不想为浏览器开发工具暴露你的 source map, 这个选项会很有用.

  > 你不应该将 source map 文件部署到 web 服务器. 而是只将其用于错误报告工具.

- nosources-source-map: 创建的 source map 不包含 sourcesContent(源代码内容). 它可以用来映射客户端上的堆栈跟踪, 而无须暴露所有的源代码. 你可以将 source map 文件部署到 web 服务器.

  > 这仍然会暴露源文件的文件名和结构, 但它不会暴露原始代码.

# 11. 构建目标 (targets)

webpack 能够为多种环境或 target 构建编译.

## 11.1 target

`string | function(compiler)`

### string

通过 `WebpackOptionsApply`, 可以支持以下字符串值:

| 选项              | 描述                                                         |
| ----------------- | ------------------------------------------------------------ |
| async-node        | 编译为类 Node.js 环境可用 (使用 fs 和 vm 异步加载)           |
| atom              | electron-main 的别名                                         |
| electron          | electron-main 的别名                                         |
| electron-main     | 编译为 Electron 主进程                                       |
| electron-renderer | 编译为 Electron 渲染进程, 使用 `JsonpTemplatePlugin`, `FunctionModulePlugin`来为浏览器环境提供目标, 使用 `NodeTargetPlugin`和 `ExternalsPlugin`为 CommonJS 和 Electron 内置模块提供目标 |
| node              | 编译为类 Node.js 环境可用 (使用 Node.js require 加载 chunk)  |
| node-webkit       | 编译为 Webkit 可用, 并且使用 jsonp 去加载 chunk. 支持 Node.js 内置模块和 `nw.gui`导入 (实验性质) |
| web               | 编译为类浏览器环境里可用 **(默认)**                          |
| webworker         | 编译成一个 WebWorker                                         |

### function

如果传入一个函数, 此函数调用时会传入一个 compiler 作为参数. 可以不使用以上任何插件, 或自定义指定插件.

```js
// 不使用任何插件
const options = {
    target: () => undefined
}

// 使用指定插件
const options = {
    target: compiler => {
        compiler.apply(
            new webpack.JsonpTemplatePlugin(options.output),
            new webpack.LoaderTargetPlugin('web')
        );
    }
}
```

# 12. watch 和 watchOptions

webpack 可以监听文件变化, 当它们修改后会重新编译.

## 12.1 watch

`boolean`

启用 Watch 模式. 这意味着在初始构建之后, webpack 将继续监听任何已解析文件的更改. 默认是关闭的.

> 注: webpack-dev-server 和 webpack-dev-middleware 里 Watch 模式默认开启.

## 12.2 watchOptions

`object`

一组用来定制 Watch 模式的选项.

## 12.3 watchOptions.aggregateTimeout

`number`

当第一个文件更改后, 会在重新构建前增加延迟. 这个选项允许 webpack 将这段时间内进行的任何其他更改都聚合到一次重新构建里, 以毫秒为单位.

```js
aggregateTimeout: 300 // 默认值
```

## 12.4 watchOptions.ignored

对于某些系统, 监听大量文件系统会导致大量的 CPU 或内存占用, 这个选项可以排除一些文件夹, 比如:

```js
ignored: /node_modules/
```

也可以使用 anymatch 模式

```js
ignored: "files/**/*.js"
```

## 12.5 watchOptions.poll

`boolean | number`

通过传递 `true`开启 polling, 或者指定毫秒进行轮询.

## 12.6 info-verbosity

`string: none | info | verbose`

默认为 info, 设置为 verbose 还会额外在增量构建的开始和结束时, 向控制台发送消息.

## 12.7 故障排除

### 发现修改, 但并未做处理

可以在运行 webpack 时, 通过使用 --progress 标志, 来验证文件修改后, 有没有通知 webpack. 如果进度显示保存, 但没有输出文件, 则可能是配置问题, 而非文件监视问题.

### 没有足够的文件观察者

确认系统中有足够多的文件观察者. 如果这个值太低, webpack 中的文件观察者将无法识别修改.

> Arch 用户，请将 `fs.inotify.max_user_watches=524288` 添加到 `/etc/sysctl.d/99-sysctl.conf` 中，然后执行 `sysctl --system`。 Ubuntu 用户（可能还有其他用户）请执行：`echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p`

### MacOS fsevents Bug

在 MacOS 中, 某些情况下文件夹可能会损坏.

### Windows Paths

因为 webpack 期望获得多个配置选项的绝对路径, 所以 windows 的路径分隔符 `\`可能会破坏某些功能.

使用正确的分隔符. 即 `path.resolve`或 `path.join`

### Vim

在某些机器上, Vim 预告将 backupcopy 选项设置为 `auto`. 这可能会导致系统的文件监视机制出现问题. 将此选项设置为 `yes`可以确保创建文件的副本, 并在保存时覆盖原始文件.

`:set backupcopy=yes`

### 在 WebStorm 中保存

使用 JetBrains WebStorm IDE 时, 你可能会发现保存修改过的文件, 并不会按照预期触发观察者. 尝试在设置中禁用 `安全写入(safe write)`选项.

# 13. 外部扩展 (externals)

externals 配置选项提供了从输出的 bundle 中排除依赖的方法.

## 13.1 externals

`string | array | object | function | regex`

防止将某些 `import`的包(package)打包到 bundle 中, 而是在运行时(runtime)再去从外部获取这些扩展依赖 (external dependencies).

例如, 从 CDN 中引入 jQuery.

index.html

```html
<script src="https://code.jquery.com/jquery-3.1.0.js"></script>
```

webpack.config.js

```js
externals: {
    jquery: 'jQuery'
}
```

这样的话在代码中

```js
import $ from 'jquery';

// jquery 并不会打包到 bundle 中, 而是通过 index.html 的 script 标签引入的 jquery
```

```js
// string 形式, 属性名 jquery 表示应该排除 import $ from 'jquery' 中的 jquery 模块. jQuery 或 $ 都是 jquery 模块内部提供的变量名
externals: {
    jquery: 'jQuery'
}

// object 形式, 表示在 AMD 和 CommonJS 模块系统下通过 lodash 访问, 但在全局变量形式下用 _ 访问.
externals: {
    lodash: {
        commonjs: 'lodash',
        amd: 'lodash',
        root: '_'
    }
}

// array 形式
externals: {
    subtract: ['lib/a', 'lib/b']
}
```

# 14. 性能 (performance)

这些选项可以控制 webpack 如何通知资源(asset)和入口起点超过指定文件限制.

## 14.1 performance

`object`

配置如何展示性能提示.

## 14.2 performance.hints

`false | 'error' | 'warning'`

打开/关闭提示. 当有提示时, 告诉 webpack 抛出一个错误或警告. 此属性默认设置为 `'warning'`.

## 14.3 performance.maxEntrypointSize

`int`

针对指定的入口, 所有资源的初始加载时(initial load time). 默认值 `250000`(bytes).

## 14.4 performance.maxAssetSize

`int`

单个资源体积. 默认值 `250000` (bytes).

## 14.5 performance.assetFilter

`function`

控制 webpack 用于计算性能提示的文件. 默认函数如下:

```js
function(assetFilename) {
    return !(/\.map$/.test(assetFilename));
}
```

如果要改成只针对 .js 文件提示:

```js
performance: {
    assetFilter: function(assetFilename) {
        return assetFilename.endsWith('.js');
    }
}
```

# 15. Node

这些选项可以配置是否 polyfill 或 mock 某些 Node.js 全局变量和模块. 这可以使初始为 Node.js 环境编写的代码, 在其他环境(如浏览器)中运行.

## 15.1 node

`object`

每个属性对应 Node.js 的全局变量或模块, 每个属性的值是以下其中之一:

- true: 提供 polyfill.
- "mock": 提供 mock 实现预期接口, 但功能很少或没有.
- "empty": 提供空对象.
- false: 什么都不提供 

这里是默认值:

```js
node: {
    console: false,
    global: true,
    process: true,
    __filename: 'mock',
    __dirname: 'mock',
    Buffer: true,
    setImmediate: true
}
```

从 webpack 3.0.0 开始, node 选项可能被设置为 `false`, 以完全关闭 `NodeStuffPlugin`和 `NodeSourcePlugin`插件.

## 15.2 node.console

`boolean | "mock"`

默认值为 false.

浏览器提供了一个 console 对象, 非常类似于 Node.js 的 console, 所以通常不需要 polyfill.

## 15.3 node.process

`boolean | "mock"`

默认值为 true.

## 15.4 node.global

`boolean`

默认值为 true.

## 15.5 node.__filename

`boolean | "mock"`

默认值为 "mock"

选项:

- true: 输入文件的文件名, 是相对于 context 选项的.
- false: 常规的 Node.js __filename 的行为. 在 Node.js 环境中运行时, 输出文件的文件名.
- "mock": value 填充为 "index.js"

## 15.6 node.__dirname

`boolean | "mock"`

默认值为 "mock"

选项:

- true: 输入文件的目录名, 是相对于 context 选项.
- false: 常规的 Node.js __dirname 行为. 在 Node.js 环境中运行时, 输出文件的目录名.
- "mock": value 填充为 "/".

## 15.7 node.Buffer

`boolean | "mock"`

默认值为 true

## 15.8 node.setImmediate

`boolean | "mock" | "empty"`

默认值为 true

## 15.9 其他 Node.js 核心库 (Node.js core libraries)

`boolean | "mock" | "empty"`

只有当 target 是未指定, "web" 或 "webworker" 这三种情况时, 此选项才会被激活(通过 NodeSourcePlugin)

当 NodeSourcePlugin 插件启用时, 则会使用 node-libs-browser 来对 Node.js 核心库 polyfill.

# 16. 统计信息 (stats)

如果不希望使用 `quiet`或 `noInfo`, 但又不想得到全部的信息, 只是想要获取某部分 bundle 的信息, 使用 stats 选项是比较好的折衷方式.

> 对于  webpack-dev-server, 这个属性需要放在 devServer 对象里.
>
> 当使用 Node.js API 时, 此选项无效.

## 16.1 stats

`object | string`

类型为 string 时的快捷方式:

| Preset        | sd    | Description                    |
| ------------- | ----- | ------------------------------ |
| "errors-only" | none  | 只在发生错误时输出             |
| "minimal"     | none  | 只在发生错误或有新的编译时输出 |
| "none"        | false | 没有输出                       |
| "normal"      | true  | 标准输出                       |
| "verbose"     | none  | 全部输出                       |

也可以使用对象精确控制:

```js
stats: {

  // 未定义选项时，stats 选项的备用值(fallback value)（优先级高于 webpack 本地默认值）
  all: undefined,

  // 添加资源信息
  assets: true,

  // 对资源按指定的字段进行排序
  // 你可以使用 `!field` 来反转排序。
  assetsSort: "field",

  // 添加构建日期和构建时间信息
  builtAt: true,

  // 添加缓存（但未构建）模块的信息
  cached: true,

  // 显示缓存的资源（将其设置为 `false` 则仅显示输出的文件）
  cachedAssets: true,

  // 添加 children 信息
  children: true,

  // 添加 chunk 信息（设置为 `false` 能允许较少的冗长输出）
  chunks: true,

  // 将构建模块信息添加到 chunk 信息
  chunkModules: true,

  // 添加 chunk 和 chunk merge 来源的信息
  chunkOrigins: true,

  // 按指定的字段，对 chunk 进行排序
  // 你可以使用 `!field` 来反转排序。默认是按照 `id` 排序。
  chunksSort: "field",

  // 用于缩短 request 的上下文目录
  context: "../src/",

  // `webpack --colors` 等同于
  colors: false,

  // 显示每个模块到入口起点的距离(distance)
  depth: false,

  // 通过对应的 bundle 显示入口起点
  entrypoints: false,

  // 添加 --env information
  env: false,

  // 添加错误信息
  errors: true,

  // 添加错误的详细信息（就像解析日志一样）
  errorDetails: true,

  // 将资源显示在 stats 中的情况排除
  // 这可以通过 String, RegExp, 获取 assetName 的函数来实现
  // 并返回一个布尔值或如下所述的数组。
  excludeAssets: "filter" | /filter/ | (assetName) => ... return true|false |
    ["filter"] | [/filter/] | [(assetName) => ... return true|false],

  // 将模块显示在 stats 中的情况排除
  // 这可以通过 String, RegExp, 获取 moduleSource 的函数来实现
  // 并返回一个布尔值或如下所述的数组。
  excludeModules: "filter" | /filter/ | (moduleSource) => ... return true|false |
    ["filter"] | [/filter/] | [(moduleSource) => ... return true|false],

  // 和 excludeModules 相同
  exclude: "filter" | /filter/ | (moduleSource) => ... return true|false |
    ["filter"] | [/filter/] | [(moduleSource) => ... return true|false],

  // 添加 compilation 的哈希值
  hash: true,

  // 设置要显示的模块的最大数量
  maxModules: 15,

  // 添加构建模块信息
  modules: true,

  // 按指定的字段，对模块进行排序
  // 你可以使用 `!field` 来反转排序。默认是按照 `id` 排序。
  modulesSort: "field",

  // 显示警告/错误的依赖和来源（从 webpack 2.5.0 开始）
  moduleTrace: true,

  // 当文件大小超过 `performance.maxAssetSize` 时显示性能提示
  performance: true,

  // 显示模块的导出
  providedExports: false,

  // 添加 public path 的信息
  publicPath: true,

  // 添加模块被引入的原因
  reasons: true,

  // 添加模块的源码
  source: true,

  // 添加时间信息
  timings: true,

  // 显示哪个模块导出被用到
  usedExports: false,

  // 添加 webpack 版本信息
  version: true,

  // 添加警告
  warnings: true,

  // 过滤警告显示（从 webpack 2.4.0 开始），
  // 可以是 String, Regexp, 一个获取 warning 的函数
  // 并返回一个布尔值或上述组合的数组。第一个匹配到的为胜(First match wins.)。
  warningsFilter: "filter" | /filter/ | ["filter", /filter/] | (warning) => ... return true|false
};
```

# 17. 其他选项 (other options)

## 17.1 amd

设置 `require.amd`或 `define.amd`的值:

```js
amd: {
    jQuery: true
}
```

## 17.2 bail

`boolean`

在第一个错误出现时抛出失败结果, 而不是容忍它. 默认情况下, 当使用 HMR 时, webpack 会在终端和浏览器控制台中, 以红色文字记录这些错误, 但仍然继续进行打包. 如果启用了它, webpack 将退出打包过程.

## 17.3 cache

`boolean | object`

缓存生成的 webpack 模块和 chunk, 来改善构建速度. 缓存默认在观察模式(watch mode)启用.

如果传入一个对象, webpack 会在这个对象中缓存, 这样可以在 compiler 之间共享同一缓存:

```js
let SharedCache = {};

export default {
    // ...
    cache: SharedCache
}
```

## 17.4 loader

`object`

在 loader 上下文中暴露自定义值.

## 17.5 parallelism

`number`

## 17.6 profile

`boolean`

捕获一个应用程序"配置文件", 包括统计和提示, 然后可以使用 Analyze 分析工具进行详细分析.

> 使用 `StatsPlugin`可以更好地控制生成的配置文件.

## 17.7 recordsPath

开启这个选项可以生成一个 JSON 文件, 其中包含 webpack 的 "records"记录, 即用于存储跨多次构建(across multiple builds)的模块标识符的数据片段. 可以使用此文件来跟踪每次构建之间的模块变化.

```js
recordsPath: path.join(__dirname, 'records.json');
```

如果使用了代码分离(code splitting)这样的复杂配置, records 会特别有用. 这些数据用于确保拆分 bundle, 以便实现缓存(caching)行为.

> 本质上讲设置 `recordsPath`会把 `recordsInputPath`和 `recordsOutputPath`都设置成相同的路径. 通常这也是符合逻辑的, 除非你决定改变记录文件的名称.

## 17.8 recordsInputPath

指定读取最后一条记录的文件的名称. 这可以用来重命名一个记录文件.

## 17.9 recordsOutputPath

指定记录要写入的位置.