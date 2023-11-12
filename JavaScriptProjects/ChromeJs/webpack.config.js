const path = require('path');

module.exports = {
  entry: './backend/middlewares/api.js',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'webpackBundle'), 
    filename: 'bundle.js',
  },
};
