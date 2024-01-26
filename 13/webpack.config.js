const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    polyfills: './src/polyfills.js',
    index: './src/index.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      // {
      //   test: require.resolve('index.js'),
      //   use: 'imports-loader?this=>window',
      // },
      // {
      //   test: /\.js$/,
      //   use: 'exports-loader?file',
      // },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      title: 'shimming',
    }),
    new webpack.ProvidePlugin({
      // _: 'lodash',
      join: ['lodash', 'join'],
    }),
  ],
};
