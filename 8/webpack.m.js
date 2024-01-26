const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');
const ClosurePlugin = require('closure-webpack-plugin');

module.exports = merge(common, {
  // devtool: 'inline-source-map',
  // devServer: {
  //   contentBase: './dist',
  // },
  mode: 'development',
  optimization: {
    minimize: true,
    // minimizer: [
    //   new TerserPlugin()
    //   // new ClosurePlugin(),
    // ],
  },
  output: {
    filename: 'm.bundle.js',
  },
});
