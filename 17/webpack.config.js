const path = require('path');

console.log('NODE_ENV: ', process.env.NODE_ENV);
console.log('Production: ', process.env.production);

module.exports = (env) => {
  console.log('NODE_ENV: ', env.NODE_ENV);
  console.log('Production: ', env.production);
  return {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
  };
};
