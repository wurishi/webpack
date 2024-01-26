const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { options } = webpack({
  mode: 'development',
  entry: './1.js',
  module: {
    rules: [
      {
        test: /\.txt$/,
        use: 'raw-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js',
  },
});

module.exports = options;
