const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.js',
  },
  plugins: [new HTMLWebpackPlugin({ title: '动态导入' })],
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
