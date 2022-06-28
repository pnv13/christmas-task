const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    compress: true,
    host: 'localhost',
    port: 8080,
    static: path.resolve(__dirname, 'dist'),
  },
};
