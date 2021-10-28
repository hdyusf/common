/**
 * @description: 异步-截流
 * @param {Function} fuc
 * @param {number} waitTime
 * @returns {Function}
 */
export const throttle = (fuc, waitTime) => {
  if (typeof fuc !== 'function') {
    throw new TypeError('Expected a function');
  }
  let waiting = false;
  let timer = {};
  return (params = {}) => {
    // 拦截指定时间内的后续请求
    if (waiting) {
      return {
        data: null,
        status: 303
      };
    }
    waiting = true;
    timer = setTimeout(() => {
      waiting = false;
      clearTimeout(timer);
    }, waitTime);
    return fuc(params);
  };
};

/**
 * @description: 异步-防抖
 * @param {Function} fuc
 * @param {number} waitTime
 * @returns {Function}
 */
export const debounce = (fuc, waitTime) => {
  if (typeof fuc !== 'function') {
    throw new TypeError('Expected a function');
  }
  let timer = null;
  let rj = null;
  return async (params = {}) => {
    let arr = new Promise((resolve) => {
      if (timer) {
        // 释放上次的队列
        clearTimeout(timer);
        timer = null;
        // 释放上次的promise
        rj({
          data: null,
          status: 303
        });
      }
      timer = setTimeout(async () => {
        timer = null;
        rj = null;
        let res = await fuc(params);
        resolve(res);
      }, waitTime);
      rj = resolve;
    });
    let a = await arr;
    return a;
  };
};
