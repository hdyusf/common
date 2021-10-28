/**
 * @description: 手机设备判断
 * @return {string | boolean}
 */
export const isPhone = () => {
  const u = navigator.userAgent;
  const isAndroid = u.indexOf('Android') > -1;
  const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  if (isAndroid) {
    return 'A';
  }
  if (isIOS) {
    return 'S';
  }
  return false;
};

/**
 * @description: 判断微信
 * @return {boolean}
 */
export const isWeiXin = () => {
  const ua = window.navigator.userAgent.toLowerCase();
  let a = ua.match(/MicroMessenger/i);
  if (a && a[0] === 'micromessenger') {
    return true;
  } else {
    return false;
  }
};

/**
 * @description: 判断QQ
 * @return {boolean}
 */
export const isQQ = () => {
  const ua = window.navigator.userAgent.toLowerCase();
  if (ua.indexOf(' qq') > -1 && ua.indexOf('mqqbrowser') < 0) {
    return true;
  } else {
    return false;
  }
};

/**
 * @description: 是否是手机格式
 * @param {string} val 手机号
 * @return {boolean}
 */
export const isPhoneMode = (val) => {
  const reg = /^1[3-5789]\d{9}$/;
  if (reg.test(val)) {
    return true;
  } else {
    return false;
  }
};

/**
 * @description: 是否是邮箱格式
 * @param {string} val 邮箱
 * @return {boolean}
 */
export const isEmailMode = (val) => {
  const reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
  if (reg.test(val)) {
    return true;
  } else {
    return false;
  }
};

/**
 * @description: 是否是支付宝内核
 * @param {*}
 * @return {boolean}
 */
export const isAlipay = () => {
  if (typeof navigator === 'undefined') {
    return false;
  }

  const ua = navigator.userAgent.toLowerCase();
  return ua.indexOf('alipayclient') !== -1;
};

/**
 * @description: 是否为有效的车牌号码
 * @param {string} 车牌
 * @return {boolean}
 * 1.常规车牌号：仅允许以汉字开头，后面可录入六个字符，由大写英文字母和阿拉伯数字组成。如：粤B12345；
 * 2.武警车牌：允许前两位为大写英文字母，后面可录入七个字符，由大写英文字母和阿拉伯数字组成，其中第三位可录汉字也可录大写英文字母及阿拉伯数字，如：WJ01警0081、WJ0112345。
 * 3.最后一个为汉字的车牌：允许以汉字开头，后面可录入六个字符，前五位字符，由大写英文字母和阿拉伯数字组成，而最后一个字符为汉字，汉字包括“挂”、“学”、“警”、“军”、“港”、“澳”。如：粤Z1234港。
 * 4.新军车牌：以两位为大写英文字母开头，后面以5位阿拉伯数字组成。如：BA12345。
 * 5.黑龙江车牌存在08或38开头的情况。
 * isLicenseNo('浙A12345');
 * => true
 */
export const isLicenseNo = (val) => {
  const reg = /(^[\u4E00-\u9FA5]{1}[A-Z0-9]{6}$)|(^[A-Z]{2}[A-Z0-9]{2}[A-Z0-9\u4E00-\u9FA5]{1}[A-Z0-9]{4}$)|(^[\u4E00-\u9FA5]{1}[A-Z0-9]{5}[挂学警军港澳]{1}$)|(^[A-Z]{2}[0-9]{5}$)|(^(08|38){1}[A-Z0-9]{4}[A-Z0-9挂学警军港澳]{1}$)/;

  return reg.test(val);
};

/**
 * @description: 是否为有效的身份证号
 * @param {string}
 * @return {boolean}
 */
export const isCardId = (val) => {
  const reg = /^\d{6}(19|2\d)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X|x)?$/;

  return reg.test(val);
};

/**
 * @description: 是否为有效的邮箱
 * @param {string}
 * @return {boolean}
 */
export const isValidEmail = (val) => {
  const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/i;

  return reg.test(val);
};

/**
 * @description: 是否为有效的密码(6-16位字母加数字组合，不能包含空格和特殊符号)
 * @param {string}
 * @return {boolean}
 */
export const isValidPassword = (val) => {
  const reg = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{6,16}$/;
  return reg.test(val);
};

/**
 * @description: 是否为有效的url
 * @param {string}
 * @return {boolean}
 */
export const isValidURI = (url) => {
  const protocols = '((https?|s?ftp|irc[6s]?|git|afp|telnet|smb):\\/\\/)?';
  const userInfo = '([a-z0-9]\\w*(\\:[\\S]+)?\\@)?';
  const domain = '([a-z0-9]([\\w]*[a-z0-9])*\\.)?[a-z0-9]\\w*\\.[a-z]{2,}(\\.[a-z]{2,})?';
  const port = '(:\\d{1,5})?';
  const ip = '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}';
  const address = '(\\/\\S*)?';
  const domainType = [protocols, userInfo, domain, port, address];
  const ipType = [protocols, userInfo, ip, port, address];

  const verify = function(type) {
    return new RegExp(`^${type.join('')}$`, 'i').test(url);
  };

  return verify(domainType) || verify(ipType);
};

/**
 * @description: 浏览器标签页是否激活
 * @param {function}
 * @return {void}
 */
export const isBrowserTabActive = (callback) => {
  let hiddenProperty = 'hidden' in document ? 'hidden' : 'webkitHidden' in document ? 'webkitHidden' : 'mozHidden' in document ? 'mozHidden' : '';
  let visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
  let onVisibilityChange = function() {
    if (document[hiddenProperty]) {
      // 未激活状态
      callback(false);
    } else {
      // 激活状态
      callback(true);
    }
  };
  onVisibilityChange();
  // IE10+
  document.addEventListener(visibilityChangeEvent, onVisibilityChange);
};

/**
 * @description: 判断是否是IE
 * @param {string}
 * @return {boolean}
 */
export const isIE = () => {
  if (!!window.ActiveXObject || 'ActiveXObject' in window) {
    return true;
  } else {
    return false;
  }
};
