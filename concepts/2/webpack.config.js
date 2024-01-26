const webpack = require('webpack');
const HP = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// __webpack_public_path__ = 'http://cdn.example.com/assets/[hash]/';

const { options } = webpack({
  // entry: ['./1.js', './2.js'],
  entry: {
    1: './1.js',
    2: './2.js',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HP(), //
  ],
  output: {
    filename: '[name].js',
    path: __dirname + '/dist/[hash]',
    publicPath:'http://cdn.example.com/assets/[hash]/'
  },
});

module.exports = options;
