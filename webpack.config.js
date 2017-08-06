const path = require('path');

// The following is the arrangement for MULTIPLE export files

const distPath = path.resolve(__dirname, 'dist');
const rules = [
  { test: /\.css$/,
    use: [
      'style-loader',
      'css-loader'
    ]
  },
  { test: /\.(jpeg|png|gif|svg|ttf|eot|woff|woff2)$/,
    use: [
      'file-loader'
    ]
  },
  { test: /\.jsx$/,
    loader: 'babel-loader',
    exclude: /node_modules/,
    options: {
      presets: ['es2015', 'react']
    }
  }
];

module.exports = [{
  entry: './src/troll.jsx',
  output: {
    filename: 'bundle-troll.js',
    path: distPath
  },
  module: {
    rules: rules
  }
}];
