const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/index.js',
  plugins: [
    new HtmlWebpackPlugin({
      title: '懒加载',
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};
