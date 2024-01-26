const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

module.exports = {
  entry: {
    index: './src/index.js',
    another: './src/another-module.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        // use: ExtractTextPlugin.extract({
        //   fallback: 'style-loader',
        //   use: 'css-loader',
        // }),
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.bundle\.js$/,
        use: 'bundle-loader',
      },
      {
        test: /\.p\.js$/,
        loader: 'promise-loader?global',
      },
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      title: '代码分离',
    }),
    // new ExtractTextPlugin('styles.css'),
    new MiniCssExtractPlugin(),
    new BundleAnalyzerPlugin()
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'chunk',
    },
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  // mode: 'development',
};
