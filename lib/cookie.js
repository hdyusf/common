import { parseUrl } from './url';

/**
 * @description:获取cookie
 * @param {string} 名称
 * @return {string | void}
 */
export const getCookie = (name) => {
  let reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
  let arr = document.cookie.match(reg);
  if (arr) {
    return unescape(arr[2]);
  } else {
    return;
  }
};

/**
 * @description:设置cookie
 * @param {string} 名称
 * @param {string} 值
 * @param {time} 过期时间
 * @param {string} 域
 * @return {void}
 */
export const setCookie = (name, value, expired = 24 * 60 * 60 * 1000, domain) => {
  let exudate = new Date();
  exudate.setDate(exudate.getTime() + expired);
  document.cookie = `${name}=${escape(value)};expires=${exudate.toUTCString()};${domain ? `domain=${domain}` : ''}`;
};

/**
 * @description:删除cookie
 * @param {string} 名称
 * @return {void}
 */
export const clearCookie = (name) => {
  setCookie(name, '', -1);
};

/**
 * @description:模糊匹配获取cookie
 * @param {string} 名称
 * @return {string | void}
 */
export const matchCookie = (name) => {
  let reg = new RegExp(`(^| )(?:[^=]*)${name}(?:[^=]*)=([^;]*)(;|$)`, 'g');
  let arr = document.cookie.match(reg);
  let obj = {};
  if (arr) {
    arr.forEach((item) => {
      let a = item.replace(';', '').split('=');
      a[1] = decodeURIComponent(a[1]);
      obj[a[0].trim()] = a[1];
    });
  }
  return obj;
};

/**
 * @description:获取domain
 * @return {string | void}
 */
export const getDomain = () => {
  let target = 'ONCE_CEUI';
  let url = window.top.location.href;
  let parse = parseUrl(url);
  let arr = parse.host.split('.');
  let fc = (arr, i = 0, d = 1) => {
    let ti = i + 2;
    let sp = arr.splice(-ti, ti);
    return sp.join('.');
  };

  for (let i = 0; i <= 2; i++) {
    let domain = fc(arr.concat(), i);
    setCookie(target, domain, 24 * 60 * 60 * 1000, domain);
    let ceui = getCookie(target);
    if (ceui) {
      setCookie(target, '', -1, domain);
      i = 3;
      return ceui;
    }
  }
};
