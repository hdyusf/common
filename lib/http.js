import qs from 'qs';
let responseCallback = null;
let axios = null;

/**
 * @description: 网络请求配置
 * @param {function} 请求成功后的回调函数
 * @return {void}
 */
export const httpConfig = (axiosInstance, resCall) => {
  axios = axiosInstance;
  responseCallback = resCall;
};

/**
 * @description: axios封装网络请求
 * @param {string} 请求类型
 * @param {string} 地址
 * @param {object} 传参
 * @param {object} 请求配置参数
 * @return {promise}
 */
export const http = (type, url, params, configs = {}) => {
  if (type === 'get' && params) {
    url = `${url}?${qs.stringify(params, { arrayFormat: 'indices' })}`;
    params = {};
  }
  let config = {
    ...configs
  };
  if (type === 'file') {
    type = 'post';
    let formdata = new FormData();
    for (let [key, value] of Object.entries(params)) {
      formdata.append(key, value);
    }
    params = formdata;
    config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      ...configs
    };
  }
  let response = axios[type](url, params, config);
  let thenCallback = () => {};
  let catchCallback = () => {};
  let allCallback = () => {};
  response
    .then((res) => {
      if (responseCallback(res)) {
        thenCallback(res);
      }
      allCallback(res);
    })
    .catch((res) => {
      console.error(`[ catch ](${url})`, res);
      catchCallback(res);
      allCallback();
    });
  return {
    then(callback) {
      thenCallback = callback;
      return this;
    },
    catch(callback) {
      catchCallback = callback;
    },
    all(callback) {
      allCallback = callback;
    }
  };
};
