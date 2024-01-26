const webpack = require('webpack');
const path = require('path');
const HP = require('html-webpack-plugin');

module.exports = webpack({
  entry: './index.js',
  devServer: {
    open: true,
  },
  plugins: [
    new HP({
      template: './index.html',
    }),
  ],
  externals: {
    jquery: '$',
  },
}).options;
