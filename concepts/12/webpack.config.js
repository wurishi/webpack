const webpack = require('webpack');
const path = require('path');

const serverConfig = webpack({
  entry: './1.js',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'lib.node.js',
  },
  mode: 'development',
}).options;

const clientConfig = webpack({
  entry: './1.js',
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'lib.js',
  },
  mode: 'development',
}).options;

module.exports = [serverConfig, clientConfig];
