import { toNumber } from "./number";
/**
 * @description: 主动防御 避免获取不存在对象属性值时报错
 * @param {string[]} 属性名称数组
 * @param {object} 查询对象
 * @return {*}
 * var props = {
 *  user: {
 *    post: [{
 *      comments: 'test'
 *    }]
 *  }
 * };
 * getObjValue(['user', 'post', 0, 'comments'], props);
 * => test
 */
export const getObjValue = (p, o) => {
  return p.reduce((xs, x) => {
    return xs && xs[x] ? xs[x] : null;
  }, o);
};

/**
 * @description: 深度合并对象 相同键后面的会覆盖前面的
 * @param {object}
 * @return {object}
 */
export const deepAssign = (...args) => {
  let isPlainObject = (obj) => {
    return Object.prototype.toString.call(obj) === '[object Object]';
  };
  if (args.length < 2) return args[0];
  let result = args[0];
  args.shift();
  args.forEach((item) => {
    if (isPlainObject(item)) {
      if (!isPlainObject(result)) result = {};
      for (let key of Object.keys(item)) {
        if (result[key] && isPlainObject(item[key])) {
          result[key] = deepAssign(result[key], item[key]);
        } else {
          result[key] = item[key];
        }
      }
    } else if (item instanceof Array) {
      if (!(result instanceof Array)) result = [];
      item.forEach((arrItem, arrIndex) => {
        if (isPlainObject(arrItem)) {
          result[arrIndex] = deepAssign(result[arrIndex]);
        } else {
          result[arrIndex] = arrItem;
        }
      });
    }
  });
  return result;
};

/**
 * @description: 深度循环对象 处理对象中科学记数法问题
 * @param {object}
 * @return {*}
 */
export const deepObjectToNumber = (res) => {
  if (res) {
    let loop = (r) => {
      if (typeof r === 'object' && r !== null) {
        for (let [item, value] of Object.entries(r)) {
          if (typeof value === 'number') {
            if (value.toString().indexOf('e') > -1 || value.toString().indexOf('E') > -1) {
              r[item] = toNumber(value).toString();
            }
          }
          if (typeof value === 'object') {
            loop(value);
          }
        }
      }
    };
    loop(res);
  }
  return res;
};
