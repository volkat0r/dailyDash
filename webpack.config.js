const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.js', // Einstiegspunkt
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true, // dist vor Build löschen
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',      // CSS ins DOM einfügen
          'css-loader',        // CSS in JS übersetzen
          'postcss-loader',    // PostCSS (für Tailwind etc.)
          {
            loader: 'sass-loader',       // SCSS zu CSS kompilieren
            options: {
                sassOptions: {
                    includePaths: ['./src/styles']
                }
            }
          }
        ],
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // HTML-Vorlage
    }),
  ],
  devServer: {
    static: './dist',
    port: 3000,
    open: true,
    hot: true,
  },
  mode: 'development',
  devtool: 'source-map',
};