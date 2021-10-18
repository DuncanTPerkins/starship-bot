const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  target: 'node',
  entry: {
    main: './main.ts'
  },
  target: 'node',
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
    new Dotenv()
  ],
  resolve: {
    modules: ['node_modules'],
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'build'),
  },
};