const webpack = require('webpack');
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const options = webpack({
  entry: './src/index.js',
  plugins: [
    new CleanWebpackPlugin(), //
    new HTMLWebpackPlugin(),
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
}).options;

module.exports = options;
