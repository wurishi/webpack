const webpack = require('webpack');
const path = require('path');

module.exports = webpack({
  mode: 'production', // production | development | none
  entry: './app/entry', // string | array | object
  // webpack 从这里开始执行打包

  output: {
    // webpack 如何输出

    path: path.resolve(__dirname, 'dist'), // string
    // 所有输出文件的目标路径, 必须是绝对路径
    filename: 'bundle.js', // string

    publicPath: '/assets/', // string
    // 输出解析文件的目录, url 相对于 HTML 页面
    library: 'MyLibrary', // string
    // 导出库(exported library)的名称
    libraryTarget: 'umd', // string var(default) | this | commonjs | commonjs2 | amd | umd | window | assign | jsonp | system
    // 导出库(exported library)的类型
  },

  module: {
    // 模块配置

    rules: [
      // 模块配置(配置 loader, 解析器等选项)
      {
        test: /\.jsx?$/,
        include: [path.resolve(__dirname, 'app')],
        exclude: [path.resolve(__dirname, 'app/demo-files')],
        /**
         * 这里是匹配条件, 每个选项都接收一个正则表达式或字符串
         * test 和 include 具有相同的作用, 都是匹配选项
         * exclude 是不匹配选项 (优先于 test 和 include)
         * 最佳实践:
         * - 只在 test 和 文件名匹配 使用正则表达式
         * - 在 include 和 exclude 中使用绝对路径数组
         * - 尽量避免 exclude
         */
        issuer: { test, include, exclude },
        // issuer 条件 (导入源)
        enforce: 'pre',
        enforce: 'post',
        // 标识应用这些规则

        loader: 'babel-loader',
        // 应用的 loader

        options: {
          presets: ['es2015'],
        },
        // loader 的可选项
      },

      {
        test: /\.html$/,
        use: [
          // 可应用多个 loader 和选项
          'htmllint-loader',
          {
            loader: 'html-loader',
            options: {},
          },
        ],
      },

      { oneOf: [] },
      // 只使用这些嵌套规则之一

      { rules: [] },
      // 使用所有这些嵌套规则

      { resource: { and: [] } },
      // 仅当所有条件都匹配
      { resource: { or: [] } },
      { resource: [] },
      // 任意条件匹配
      { resource: { not: '' } },
      // 条件不匹配
    ],
  },

  resolve: {
    // 解析模块请求的选项
    // 不适用于对 loader 解析
    modules: ['node_modules', path.resolve(__dirname, 'app')],
    // 用于查找模块的目录
    extensions: ['.js', '.json', '.jsx', '.css'],
    // 使用的扩展名
    alias: {
      // 模块别名列表
      module: 'new-module',
      // 起别名: 'module' -> 'new-module' 即: 'module/path/file' -> 'new-module/path/file'
      'only-module$': 'new-module',
      // 起别名: 'only-module' -> 'new-module; , 但不匹配 'only-module/path/file' X->X 'new-module/path/file'
      module: path.resolve(__dirname, 'app/third/module.js'),
      // 模块别名相对于当前上下文导入 起别名: 'module' -> './app/thired/module.js' 注意 'module/file'会导致错误
    },
  },

  performance: {
    hints: 'warning', // false | 'warning' | 'error'
    maxAssetSize: 200000, // 整数类型 (以字节为单位)
    maxEntrypointSize: 400000, // 整数类型 (以字节为单位)
    assetFilter: function (assetFilename) {
      // 提供资源文件的断言函数
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    },
  },

  devtool: 'source-map', // enum
  // 通过在浏览器调试工具(browser devtools)中添加元信息(meta info)增强调试
  // 牺牲了构建速度的 'source-map' 是最详细的

  context: __dirname, // string (绝对路径)
  // webpack 的主目录
  // entry 和 module.rules.loader 选项相对于此目录解析

  target: 'web', // 枚举
  // 包(bundle)运行的环境,
  // 更改 块加载行为(chunk loading behavior)和可用模块(available module)

  externals: ['react', /^@angular\//],
  // 不要打包这些模块, 而是在运行时从环境中请求他们

  stats: 'errors-only',
  // 精确控制要显示的 bundle 信息

  devServer: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
    contentBase: path.join(__dirname, 'public'), // boolean | string | array , static 文件路径
    compress: true, // 是否开启 gzip 压缩
    historyApiFallback: true, // 404 时 返回到哪里(默认为index.html)
    hot: true, // HMR
    https: false, // 是否开启 https
    noInfo: true, // 仅 errors 和 warns 才 hot reload
  },

  plugins: [],
  // 插件列表
  //
}).options;

const test = {
  historyApiFallback: {
    rewrites: [
      {
        from: /.*/g,
        to: '/page/index.html',
      },
    ],
  },
};
