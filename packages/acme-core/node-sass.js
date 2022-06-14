const sass = require('node-sass');
const path = require('path')

const result = sass.renderSync({
  file: path.resolve(__dirname, 'dist/styles/css/'),
  outputStyle: 'compressed',
  outFile: '/to/my/output.css',
});
