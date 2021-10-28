import { toFixed } from './number';

/**
 * @description: 价格简化
 * @param {number} 价格
 * @param {number} 小数位
 * @return {string} 简化后的价格
 */
export const formatPriceUnit = (price, fixed = 2, lang = 'zh_CN') => {
  let arr = [];
  // 过滤替换
  let filterReplace = (arr) => {
    let res = `${price}`;
    // 排序倒序
    arr.sort((a, b) => {
      return b.price - a.price;
    });
    // 查找
    let find = arr.findIndex((item) => {
      return price > item.price;
    });
    // 替换
    if (find !== -1) {
      let it = arr[find];
      res = `${toFixed(price / it.price, fixed)}${it.title}`;
    }
    return res;
  };
  // 国家化区分
  if (lang === 'zh_CN') {
    arr = [
      {
        price: 10000,
        title: '万'
      },
      {
        price: 100000000,
        title: '亿'
      }
    ];
  } else {
    arr = [
      {
        price: 1000,
        title: 'K'
      },
      {
        price: 1000000,
        title: 'M'
      }
    ];
  }
  return filterReplace(arr);
};

/**
 * @description: 保留两位小数以及千分位的分隔符
 * @param {number} 价格
 * @param {number} 小数位
 * @param {number} 小数位是否强制部位
 * @return {string} 格式化后的价格
 */
export const formatPrice = (num, scale = 4, replenish = false) => {
  let str = toFixed(num, scale, replenish).toString();
  let res = str || '0';
  // 取小数部分
  let dot = '';
  const find = str.indexOf('.');
  if (find !== -1) {
    res = str.substring(0, find);
    dot = str.substring(str.length, find);
  }
  // 取到整数部分
  const intSum = res.replace(/\B(?=(?:\d{3})+$)/g, ',');
  const ret = intSum + dot;
  return ret;
};

/**
 * @description: 手机号码中间部分替换成指定符号
 * @param {string} 手机号
 * @param {string}} 替换符号
 * @return {string} 遮盖后的手机号
 * formatPhone('15858264903');
 * => 158****4903
 */
export const formatPhone = (phone, symbol = '****') => {
  return phone.toString().replace(/(\d{3})\d{4}(\d+)/, `$1${symbol}$2`);
};

/**
 * @description: 格式化银行卡
 * @param {string} 卡号
 * @return {string} 格式化后的卡号
 * formatBankCard('6225365271562822');
 * => 6225 3652 7156 2822
 * 用户在输入银行卡号时 需要以4位4位的形式显示 每隔4位加个空格 方便用户校对输入的银行卡是否正确
 * 注意点：一般数据库里面存的都是不带空格的原始数据，所以提交的时候需要过滤下空格
 * 还原 val.replace(/\s/g, '')
 */
export const formatBankCard = (val) => {
  if (typeof val !== 'string') {
    throw new Error('val');
  }

  const len = val.length;
  const reg = /(\d{4})(?=\d)/g;

  if (len < 4) {
    return val;
  } else {
    return val.replace(reg, '$1 ');
  }
};

/**
 * @description: html字符解码
 * @param {string}
 * @return {string}
 */
export const formatHtmlDecode = (str) => {
  if (typeof str === 'string' && str.length === 0) {
    return '';
  }

  const s = str.replace(/&amp;/g, '&');

  return (
    s
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      // eslint-disable-next-line quotes
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/&quot;/g, '"')
      .replace(/<br>/g, '\\n')
  );
};

/**
 * @description: html字符编码
 * @param {string}
 * @return {string}
 */
export const formatHtmlEncode = (str) => {
  if (typeof str === 'string' && str.length === 0) {
    return '';
  }

  const s = str.replace(/&/g, '&amp;');

  return s
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&#39;')
    .replace(/ /g, '&nbsp;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>');
};

/**
 * @description: 将字节转换成友好格式，如Bytes，KB，MB
 * @param {number} 字节值
 * @return {string}
 * formatFileSize(10000)
 * => 9.8 KB
 */
export const formatFileSize = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB'];
  if (bytes === 0) {
    return 'n/a';
  }
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString(), 10);
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};
