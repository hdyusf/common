const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  productionSourceMap: false,
  publicPath: './',
  outputDir: 'docs',
  chainWebpack: config => {
    config.resolve.alias.set('@', resolve('src'));
  },
};
