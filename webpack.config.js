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
      {
        test: /\.css$/, // This regex will match any CSS files
        use: [
          'style-loader', // Injects styles into the DOM
          'css-loader'    // Turns CSS into CommonJS modules
        ]
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
        { from: './src/ui/styles/', to: './src/ui/styles/' },
        { from: './src/index.html', to: 'index.html' },
      ],
    }),
  ],
};