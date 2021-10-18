const path = require('path');

module.exports = {
  entry: './main.ts',
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
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'build'),
  },
};