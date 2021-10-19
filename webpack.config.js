const path = require('path');
const webpack = require('webpack');

module.exports = {
  target: 'node',
  entry: {
    main: './main.ts'
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader'
      },
      {
          test: /\node&/,
          use: 'node-loader'
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'build'),
  },
};