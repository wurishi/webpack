const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestWebpackPlugin = require('webpack-manifest-plugin');
const webpack = require('webpack');

module.exports = {
  entry: {
    main: './src/index.js',
    vendor: ['lodash'],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new ManifestWebpackPlugin({}),
    // new CleanWebpackPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    // new webpack.NamedChunksPlugin(),
    new HtmlWebpackPlugin({
      title: '缓存',
    }),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].js',
  },
};
