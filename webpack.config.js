const Dotenv = require('dotenv-webpack');
const path = require('path');
const { webpack } = require('webpack');

module.exports = {
  entry: './main.ts',
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
  plugins: [
    new Dotenv(
      {
        path: './.env'
      }
    )
  ],
  resolve: {
    modules: ['node_modules'],
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'build'),
  },
};