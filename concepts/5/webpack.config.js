const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HP = require('html-webpack-plugin');

const { options } = webpack({
  entry: './index.ts',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              // modules: true,
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(), //
    new HP(),
  ],
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist',
  },
});

module.exports = options;
