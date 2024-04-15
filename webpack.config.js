const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/app.ts',
  mode: 'development', // Or 'production'
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/ui/styles/main.css', to: './src/ui/styles/main.css' },
        { from: 'index.html', to: 'index.html' },
      ],
    }),
  ],
};