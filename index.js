let allFuc = {
  ...require('./lib/array'),
  ...require('./lib/cookie'),
  ...require('./lib/country'),
  ...require('./lib/device'),
  ...require('./lib/dom'),
  ...require('./lib/format'),
  ...require('./lib/function'),
  ...require('./lib/http'),
  ...require('./lib/judge'),
  ...require('./lib/number'),
  ...require('./lib/object'),
  ...require('./lib/pxVw'),
  ...require('./lib/scroll'),
  ...require('./lib/string'),
  ...require('./lib/url'),
}
let install = function(Vue) {
  for(let [key, value] of Object.entries(allFuc)) {
    Vue.prototype[`$${key}`] = value;
  }
}
module.exports = {
  install,
  ...allFuc
};