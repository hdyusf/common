export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('tokenExpireTime');
};

export const isLogin = () => {
  return !!localStorage.getItem('token');
};

export const parseUrl = url => {
  const a = document.createElement('a');
  a.href = url;
  return {
    source: url,
    protocol: a.protocol.replace(':', ''),
    host: a.hostname,
    port: a.port,
    query: a.search,
    params: (function() {
      const ret = {};
      const seg = a.search.replace(/^\?/, '').split('&');
      const len = seg.length;
      let i = 0;
      let s;
      for (; i < len; i++) {
        if (!seg[i]) {
          continue;
        }
        s = seg[i].split('=');
        ret[s[0]] = s[1];
      }
      return ret;
    })(),
    file: (a.pathname.match(/\/([^/?#]+)$/i) || ['', ''])[1],
    hash: a.hash.replace('#', ''),
    path: a.pathname.replace(/^([^/])/, '/$1'),
    relative: (a.href.match(/tps?:\/\/[^/]+(.+)/) || ['', ''])[1],
    segments: a.pathname.replace(/^\//, '').split('/'),
  };
};

/**
 * @description 750原型的px转换为vw
 * @author hys
 * @date 2020-02-04
 * @param {number} px
 * @returns {string}
 */
export const pxToVw = px => {
  const ratio = 750 / 100;
  const vw = `${(px / ratio).toFixed(6)}vw`;
  return vw;
};

/**
 * @description 750原型的px转换为显示屏幕的px
 * @param {number} px
 * @returns {number}
 */
export const pxToPxRatio = px => {
  const clientWidth = document.body.clientWidth;
  const pxRatio = px * (clientWidth / 750);
  return pxRatio;
};

/**
 * @description 显示原型的px转换为vw
 * @author hys
 * @date 2020-02-13
 * @param {number} px
 * @returns {string}
 */
export const pxToVwRatio = px => {
  const clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
  const ratio = clientWidth / 100;
  const vw = `${(px / ratio).toFixed(6)}vw`;
  return vw;
};

// 保留两位小数以及千分位的分隔符
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
 * 格式化数字、金额、千分位、保留几位小数、舍入舍去
 *
 * @since 1.0.7
 * @param number 要格式化的数字
 * @param decimals 保留几位小数
 * @param decPoint 小数点符号
 * @param thousandsSep 千分位符号
 * @param roundTag 舍入参数，默认 'ceil' 向上取,'floor'向下取,'round' 四舍五入
 * @returns {XML|void|*|string}
 * @example
 *
 * formatNumber(2, 2, '.', ',');
 * // => 2.00
 */

// eslint-disable-next-line max-params
export function formatPrice2(number, decimals, decPoint, thousandsSep, roundTag) {
  let numberS = `${number}`.replace(/[^0-9+-Ee.]/g, '');
  roundTag = roundTag || 'ceil'; // 'ceil','floor','round'
  const n = !isFinite(Number(numberS)) ? 0 : Number(numberS);
  const prec = !isFinite(Number(decimals)) ? 0 : Math.abs(decimals);
  const sep = typeof thousandsSep === 'undefined' ? ',' : thousandsSep;
  const dec = typeof decPoint === 'undefined' ? '.' : decPoint;
  const re = /(-?\d+)(\d{3})/;
  let s = '';
  const toFixedFix = function(n, prec) {
    const k = Math.pow(10, prec);
    return `${parseFloat(Math[roundTag](parseFloat((n * k).toFixed(prec * 2))).toFixed(prec * 2)) / k}`;
  };
  s = (prec ? toFixedFix(n, prec) : `${Math.round(n)}`).split('.');
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, `$1${sep}$2`);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

// 处理数字小数位
// eslint-disable-next-line max-params
export const toFixed = (number, scale = 4, replenish = false, roundOff = true) => {
  let res = '';
  if (number) {
    let str = `${number}`;
    if (str.indexOf('e') > -1 || str.indexOf('E') > -1) {
      // 科学计数法
      let str = number.toFixed(scale + 1);
      res = str.substring(0, str.length - 1);
    } else if (str.indexOf('.') > -1) {
      // 小数
      if (scale === 0) {
        res = str.substring(0, str.indexOf('.'));
      } else {
        if (roundOff) {
          let resArr = res.toString().split('.');
          if (resArr[1]) {
            // 截取指定位数
            res = str.substring(0, str.indexOf('.') + scale + 1 + 1);
            // 增加四舍五入功能
            res = accDiv(Math.round(accMul(Number(res), Math.pow(10, scale))), Math.pow(10, scale)).toString();
          } else {
            // 截取指定位数
            res = str.substring(0, str.indexOf('.') + scale + 1);
          }
        } else {
          // 截取指定位数
          res = str.substring(0, str.indexOf('.') + scale + 1);
        }
      }
    } else {
      // 整数
      res = str;
    }
  }
  // 是否填充0
  if (replenish) {
    res = res || '0';
    let resArr = res.toString().split('.');
    if (resArr[1]) {
      let diff = scale - resArr[1].length;
      if (diff > 0) {
        let a = [];
        a.length = diff;
        a.fill(0);
        let pushStr = a.join('');
        res = res + pushStr;
      }
    } else {
      if (Number(scale)) {
        let a = [];
        a.length = scale;
        a.fill(0);
        let pushStr = a.join('');
        res = `${res}.${pushStr}`;
      }
    }
  }

  return res;
};

// 手机设备判断
export const judgePhone = () => {
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
 * 乘法函数，用来得到精确的乘法结果<br>
 * javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
 *
 * @param {number} arg1
 * @param {number} arg2
 * @returns {number} arg1乘以arg2的精确结果
 * @example
 *
 * accMul(0.222, 0.3333)
 * // => 0.0739926
 */
export const accMul = (arg1 = 0, arg2 = 0) => {
  let m = 0;
  const s1 = arg1.toString();
  const s2 = arg2.toString();

  try {
    m += s1.split('.')[1].length;
  } catch (e) {}
  try {
    m += s2.split('.')[1].length;
  } catch (e) {}
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m);
};

/**
 * 加法函数，用来得到精确的加法结果<br>
 * javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 *
 * @param {number} arg1
 * @param {number} arg2
 * @returns {number} arg1加上arg2的精确结果
 * @example
 *
 * accAdd(0.1, 0.2)
 * // => 0.3
 */
export function accAdd(arg1, arg2) {
  let r1;
  let r2;
  let m;
  let c;

  try {
    r1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  c = Math.abs(r1 - r2);
  m = Math.pow(10, Math.max(r1, r2));
  if (c > 0) {
    const cm = Math.pow(10, c);
    if (r1 > r2) {
      arg1 = Number(arg1.toString().replace('.', ''));
      arg2 = Number(arg2.toString().replace('.', '')) * cm;
    } else {
      arg1 = Number(arg1.toString().replace('.', '')) * cm;
      arg2 = Number(arg2.toString().replace('.', ''));
    }
  } else {
    arg1 = Number(arg1.toString().replace('.', ''));
    arg2 = Number(arg2.toString().replace('.', ''));
  }
  return (arg1 + arg2) / m;
}

/**
 * 除法函数，用来得到精确的除法结果<br>
 * javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
 *
 * @param {number} arg1
 * @param {number} arg2
 * @returns {number} arg1除以arg2的精确结果
 * @example
 *
 * accDiv(0.2, 0.3)
 * // => 0.6666666666666666
 */
export function accDiv(arg1, arg2) {
  let t1 = 0;
  let t2 = 0;
  let r1;
  let r2;

  try {
    t1 = arg1.toString().split('.')[1].length;
  } catch (e) {}
  try {
    t2 = arg2.toString().split('.')[1].length;
  } catch (e) {}
  r1 = Number(arg1.toString().replace('.', ''));
  r2 = Number(arg2.toString().replace('.', ''));
  return (r1 / r2) * Math.pow(10, t2 - t1);
}

/**
 * 减法函数，用来得到精确的减法结果<br>
 * javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
 *
 * @param {number} arg1
 * @param {number} arg2
 * @returns {number} arg1减去arg2的精确结果
 * @example
 *
 * accDiv(0.3, 0.2)
 * // => 0.1
 */
export function accSub(arg1, arg2) {
  let r1;
  let r2;
  let m;
  let n;

  try {
    r1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2)); // last modify by deeka //动态控制精度长度
  n = r1 >= r2 ? r1 : r2;
  return Number(((arg1 * m - arg2 * m) / m).toFixed(n));
}

// 科学记数法转换
export const toNumber = num => {
  // 处理非数字
  if (isNaN(num)) return num;

  // 处理不需要转换的数字
  if (!/e/i.test(num.toString())) return num;

  return num.toFixed(18).replace(/\.?0+$/, '');
};

// 判断微信
export const isWeiXin = () => {
  const ua = window.navigator.userAgent.toLowerCase();
  let a = ua.match(/MicroMessenger/i);
  if (a && a[0] === 'micromessenger') {
    return true;
  } else {
    return false;
  }
};

// 判断QQ
export const isQQ = () => {
  const ua = window.navigator.userAgent.toLowerCase();
  if (ua.indexOf(' qq') > -1 && ua.indexOf('mqqbrowser') < 0) {
    return true;
  } else {
    return false;
  }
};

/**
 * @description 是否是手机格式
 * @param {string} val
 * @returns {boolean}
 */
export const isPhoneMode = val => {
  const reg = /^1[3-578]\d{9}$/;
  if (reg.test(val)) {
    return true;
  } else {
    return false;
  }
};

/**
 * @description 是否是邮箱格式
 * @param {string} val
 * @returns {boolean}
 */
export const isEmailMode = val => {
  const reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
  if (reg.test(val)) {
    return true;
  } else {
    return false;
  }
};

/**
 * @description 关闭屏幕滚动
 * 简易版
 * 注意事项: 浮层定位需要使用fixed
 */
export const closeScroll = () => {
  const body = document.querySelector('body');
  body.style.overflow = 'hidden';
};

/**
 * @description 开启屏幕滚动
 * 简易版
 * 注意事项: 浮层定位需要使用fixed
 */
export const openScroll = () => {
  const body = document.querySelector('body');
  body.style.overflow = 'inherit';
};

/**
 * @description 复制内容方法
 * @author wht
 * @date 2020-05-14
 * @param {*} con 需要复制到粘贴板的内容
 */
export function copyContent(con) {
  const input = document.createElement('input'); // 创建一个新input标签
  input.setAttribute('readonly', 'readonly'); // 设置input标签只读属性
  input.setAttribute('value', con); // 设置input value值为需要复制的内容
  document.body.appendChild(input); // 添加input标签到页面
  input.select(); // 选中input内容
  input.setSelectionRange(0, 9999); // 设置选中input内容范围
  const iscopy = document.execCommand('copy'); // 复制
  document.body.removeChild(input); // 删除新创建的input标签
  if (iscopy) {
    // 复制成功
  }
}

/**
 * 为数字加上单位：万或亿
 *
 * @param {number} number 输入数字.
 * @param {number} decimalDigit 小数点后最多位数，默认为2
 * @return {*} 加上单位后的数字
 * @example
 *
 * priceUnitProcess(1000.01)
 * // => 1000.01
 *
 * priceUnitProcess(10000)
 * // => 1万
 *
 * priceUnitProcess(99000)
 * // => 9.9万
 *
 * priceUnitProcess(566000)
 * // => 56.6万
 *
 * priceUnitProcess(5660000)
 * // => 566万
 *
 * priceUnitProcess(44440000)
 * // => 4444万
 *
 * priceUnitProcess(11111000)
 * // => 1111.1万
 *
 * priceUnitProcess(444400000)
 * // => 4.44亿
 *
 * priceUnitProcess(400000000000000000000000)
 * // => 4000万亿亿
 *
 * priceUnitProcess(4000000000000000000000000)
 * // => 4亿亿亿
 */
export function priceUnitProcess(number, decimalDigit = 2) {
  let isNeedAbs = false;
  if (number < 0) {
    isNeedAbs = true;
    number = Math.abs(number);
  }

  let getDigit = integer => {
    let digit = -1;
    while (integer >= 1) {
      digit++;
      integer = integer / 10;
    }
    return digit;
  };

  const integer = Math.floor(number);
  const digit = getDigit(integer);
  // ['个', '十', '百', '千', '万', '十万', '百万', '千万'];
  const unit = [];

  // eslint-disable-next-line max-params
  let addWan = (integer, number, mutiple, decimalDigit) => {
    const digit = getDigit(integer);
    if (digit > 3) {
      let remainder = digit % 8;
      // ‘十万’、‘百万’、‘千万’显示为‘万’
      if (remainder >= 5) {
        remainder = 4;
      }
      return `${Math.floor(number / Math.pow(10, remainder + mutiple - decimalDigit)) / Math.pow(10, decimalDigit)}万`;
    } else {
      return (Math.floor(number / Math.pow(10, mutiple - decimalDigit)) / Math.pow(10, decimalDigit)).toString();
    }
  };

  if (digit > 3) {
    const multiple = Math.floor(digit / 8);
    if (multiple >= 1) {
      const tmp = Math.floor(integer / Math.pow(10, 8 * multiple));
      unit.push(addWan(tmp, number, 8 * multiple, decimalDigit));
      for (let i = 0; i < multiple; i++) {
        unit.push('亿');
      }
      if (isNeedAbs) {
        return `-${unit.join('')}`;
      } else {
        return unit.join('');
      }
    } else {
      if (isNeedAbs) {
        return `-${addWan(integer, number, 0, decimalDigit)}`;
      } else {
        return addWan(integer, number, 0, decimalDigit);
      }
    }
  } else {
    if (isNeedAbs) {
      return `-${number}`;
    } else {
      return number.toString();
    }
  }
}

/**
 * 手机号码中间部分替换成指定符号
 *
 * @param {string} phone
 * @param {string} symbol 默认为`*`
 * @returns {string|*|XML|void}
 * @example
 *
 * formatPhone('15858264903');
 * // => 158****4903
 */
export const formatPhone = (phone, symbol = '****') => {
  return phone.toString().replace(/(\d{3})\d{4}(\d+)/, `$1${symbol}$2`);
};

/**
 * 格式化银行卡<br>
 * 用户在输入银行卡号时，需要以4位4位的形式显示，就是每隔4位加个空格，方便用户校对输入的银行卡是否正确<br>
 * **注：**一般数据库里面存的都是不带格式的原始数据，所以提交的时候记得过滤下空格再提交哦。毕竟格式化这种算是表现层，前端展示的时候处理下就好，业务逻辑什么用到的卡号可不是格式化后的呢。<br>
 * 还原`val.replace(/\s/g, '');`
 *
 * @param {string} val
 * @returns {*}
 * @example
 *
 * formatBankCard('6225365271562822');
 * // => 6225 3652 7156 2822
 */
export function formatBankCard(val) {
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
}

/**
 * html字符解码
 *
 * @param {string} str
 * @returns {string}
 * @example
 *
 * formatHtmlDecode('&lt;script&gt;');
 * // => <script>
 */
export function formatHtmlDecode(str) {
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
}

/**
 * html字符编码
 *
 * @param {string} str
 * @returns {string}
 * @example
 *
 * formatHtmlEncode('<script>');
 * // => &lt;script&gt;
 */
export function formatHtmlEncode(str) {
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
}

/**
 * 是否是支付宝内核
 *
 * @returns {boolean}
 * @example
 *
 * isAlipay();
 * // => false
 */
export function isAlipay() {
  if (typeof navigator === 'undefined') {
    return false;
  }

  const ua = navigator.userAgent.toLowerCase();
  return ua.indexOf('alipayclient') !== -1;
}

/**
 * 是否为有效的车牌号码
 *
 * 1.常规车牌号：仅允许以汉字开头，后面可录入六个字符，由大写英文字母和阿拉伯数字组成。如：粤B12345；<br>
 * 2.武警车牌：允许前两位为大写英文字母，后面可录入七个字符，由大写英文字母和阿拉伯数字组成，其中第三位可录汉字也可录大写英文字母及阿拉伯数字，如：WJ01警0081、WJ0112345。<br>
 * 3.最后一个为汉字的车牌：允许以汉字开头，后面可录入六个字符，前五位字符，由大写英文字母和阿拉伯数字组成，而最后一个字符为汉字，汉字包括“挂”、“学”、“警”、“军”、“港”、“澳”。<br>如：粤Z1234港。
 * 4.新军车牌：以两位为大写英文字母开头，后面以5位阿拉伯数字组成。如：BA12345。<br>
 * 5.黑龙江车牌存在08或38开头的情况。<br>
 *
 * @param {string} val
 * @returns {boolean}
 * @example
 *
 * isLicenseNo('浙A12345');
 * // => true
 */
export function isLicenseNo(val) {
  const reg = /(^[\u4E00-\u9FA5]{1}[A-Z0-9]{6}$)|(^[A-Z]{2}[A-Z0-9]{2}[A-Z0-9\u4E00-\u9FA5]{1}[A-Z0-9]{4}$)|(^[\u4E00-\u9FA5]{1}[A-Z0-9]{5}[挂学警军港澳]{1}$)|(^[A-Z]{2}[0-9]{5}$)|(^(08|38){1}[A-Z0-9]{4}[A-Z0-9挂学警军港澳]{1}$)/;

  return reg.test(val);
}

/**
 * 是否为有效的手机号
 *
 * @param {string} val
 * @returns {boolean}
 * @example
 *
 * isMobile('15898745678');
 * // => true
 */
export function isMobile(val) {
  const reg = /^[1][34578]\d{9}$/;

  return reg.test(val.toString());
}

/**
 * 是否为有效的身份证号
 *
 * @param {string} val
 * @returns {boolean}
 * @example
 *
 * isCardId('411423198807127834');
 * // => true
 */
export function isCardId(val) {
  const reg = /^\d{6}(19|2\d)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X|x)?$/;
  // var reg = /^ [1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]?$/;

  return reg.test(val);
}

/**
 * 是否为有效的邮箱<br>
 * 名称允许汉字、字母、数字，域名只允许英文域名<br>
 * 中文如：杨元庆001Abc@lenovo.com.cn
 *
 * @param {string} val
 * @returns {boolean}
 * @example
 *
 * isValidEmail('123456@qq.com');
 * // => true
 */
export function isValidEmail(val) {
  const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/i;

  return reg.test(val);
}

// 是否为有效的密码(6-16位字母加数字组合，不能包含空格)
export const isValidPassword = val => {
  const reg = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{6,16}$/;
  return reg.test(val);
};

/**
 * 是否为有效的url<br>
 *
 * 支持类型:<br>
 * http(s)://(username:password@)(www.)domain.(com/co.uk)(/...)<br>
 * (s)ftp://(username:password@)domain.com/...<br>
 * git://(username:password@)domain.com/...<br>
 * irc(6/s)://host:port/... //<br>
 * afp over TCP/IP: afp://[<user>@]<host>[:<port>][/[<path>]]<br>
 * telnet://<user>:<password>@<host>[:<port>/]<br>
 * smb://[<user>@]<host>[:<port>][/[<path>]][?<param1>=<value1>[;<param2>=<value2>]]<br>
 *
 * @param {string} val
 * @returns {*}
 * @example
 *
 * isValidURI('https://github.com/lodash');
 * // => true
 */
export function isValidURI(url) {
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
}

/**
 * 将字节转换成友好格式，如Bytes，KB，MB
 *
 * @param {string} bytes
 * @returns {*}
 * @example
 *
 * formatFileSize(10000)
 * // => 9.8 KB
 */
export function formatFileSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB'];
  if (bytes === 0) {
    return 'n/a';
  }
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString(), 10);
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

/**
 * 获取设备像素比
 *
 * @returns {number}
 * @example
 *
 * // window.navigator.appVersion(5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1)
 * getPixelRatio();
 * // => 2
 */
export function getPixelRatio() {
  const ctx = document.createElement('canvas').getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const bsr =
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio ||
    1;

  return dpr / bsr;
}

/**
 * 获取浏览器的类型和版本号
 *
 * @returns {{type: string, version: string}}
 * @example
 *
 * getBrowser();
 * // => {type: "chrome", version: "60.0.3112.101"}
 */
export function getBrowser() {
  const ua = navigator.userAgent.toLowerCase();
  let type = 'UNKNOW';
  let v;
  const check = function(regex) {
    return regex.test(ua);
  };

  // IE
  if (check(/msie/) && !check(/opera/)) {
    type = 'ie';
    v = /msie[/|\s]*([\d+?.?]+)/.exec(ua);
  } else if (!check(/webkit/) && check(/gecko/) && check(/firefox/) && !check(/opera/)) {
    // firefox
    type = 'firefox';
    v = /firefox[/|\s]*([\d+?.?]+)/.exec(ua);
  } else if (check(/\bchrome\b/)) {
    // chrome
    type = 'chrome';
    v = /chrome[/|\s]*([\d+?.?]+)/.exec(ua);
  } else if (check(/applewebkit/) && check(/safari/)) {
    // safari (!check(/\bchrome\b/) is ensure by non-chrome above)
    type = 'safari';
    v = /version[/|\s]*([\d+?.?]+)/.exec(ua);
  } else if (check(/opera/)) {
    type = 'opera';
    v = /version[/|\s]*([\d+?.?]+)/.exec(ua) || /opera[/|\s]*([\d+?.?]+)/.exec(ua);
  }

  return {
    type: type,
    version: v && v[1] ? v[1] : 'UNKNOW',
  };
}

/**
 * dom操作，元素是包含某个class
 *
 * @since 1.1.5
 * @param el HTML元素
 * @param cls css类名
 * @returns {boolean}
 * @example
 *
 * <div class="box flex"></div>
 * hasClass(document.querySelector('.box'), 'flex');
 * // => true
 */
export function hasClass(el, cls) {
  if (!el || !cls) {
    return false;
  }
  if (cls.indexOf(' ') !== -1) {
    throw new Error('className should not contain space.');
  }
  if (el.classList) {
    return el.classList.contains(cls);
  } else {
    return ` ${el.className} `.indexOf(` ${cls} `) > -1;
  }
}

/**
 * dom操作，元素添加某个class
 *
 * @since 1.1.5
 * @param el HTML元素
 * @param cls css类名
 * @example
 *
 * <div class="box flex"></div>
 * addClass(document.querySelector('.box'), 'flex1');
 * // => <div class="box flex flex1"></div>
 */
export function addClass(el, cls) {
  if (!el) {
    return;
  }
  let curClass = el.className;
  const classes = (cls || '').split(' ');

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i];
    if (!clsName) {
      continue;
    }

    if (el.classList) {
      el.classList.add(clsName);
    } else {
      if (!hasClass(el, clsName)) {
        curClass += ` ${clsName}`;
      }
    }
  }
  if (!el.classList) {
    el.className = curClass;
  }
}

const trim = function(string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
};

/**
 * dom操作，元素删除某个class
 *
 * @since 1.1.5
 * @param el HTML元素
 * @param cls css类名
 * @example
 *
 * <div class="box flex"></div>
 * removeClass(document.querySelector('.box'), 'flex');
 * // => <div class="box"></div>
 */
export function removeClass(el, cls) {
  if (!el || !cls) {
    return;
  }
  const classes = cls.split(' ');
  let curClass = ` ${el.className} `;

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i];
    if (!clsName) {
      continue;
    }

    if (el.classList) {
      el.classList.remove(clsName);
    } else {
      if (hasClass(el, clsName)) {
        curClass = curClass.replace(` ${clsName} `, ' ');
      }
    }
  }
  if (!el.classList) {
    el.className = trim(curClass);
  }
}

/**
 * 主动防御
 * 对于我们操作的数据，尤其是由 API 接口返回的，时常会有一个很复杂的深层嵌套的数据结构。为了代码的健壮性，很多时候需要对每一层访问都作空值判断，就像这样：
 props.user &&
 props.user.posts &&
 props.user.posts[0] &&
 props.user.posts[0].comments &&
 props.user.posts[0].comments[0]
 代码看起来相当不美观，因此提供了一个非常简洁明了的原生的方式。
 *
 * @param p 属性列表
 * @param o 对象
 * @returns {*} 如果正常访问到，则返回对应的值，否则返回 null。
 * @example
 *
 * var props = {
 *  user: {
 *    post: [{
 *      comments: 'test'
 *    }]
 *  }
 * };
 * getIn(['user', 'post', 0, 'comments'], props);
 * // => test
 */
export function getObj(p, o) {
  return p.reduce((xs, x) => {
    return xs && xs[x] ? xs[x] : null;
  }, o);
}

/**
 * 滚动到顶部
 * 使用document.documentElement.scrollTop或document.body.scrollTop获取到顶部的距离。从顶部滚动一小部分距离。
 使用window.requestAnimationFrame（）来滚动。
 *
 * @since 1.2.1
 * @example
 *
 * scrollToTop();
 */
export function scrollToTop() {
  const c = document.documentElement.scrollTop || document.body.scrollTop;

  if (c > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, c - c / 8);
  }
}

/**
 * @description 深度合并对象
 */
export const assignDeep = (...args) => {
  let isPlainObject = obj => {
    return Object.prototype.toString.call(obj) === '[object Object]';
  };
  if (args.length < 2) return args[0];
  let result = args[0];
  args.shift();
  args.forEach(item => {
    if (isPlainObject(item)) {
      if (!isPlainObject(result)) result = {};
      for (let key of Object.keys(item)) {
        if (result[key] && isPlainObject(item[key])) {
          result[key] = assignDeep(result[key], item[key]);
        } else {
          result[key] = item[key];
        }
      }
    } else if (item instanceof Array) {
      if (!(result instanceof Array)) result = [];
      item.forEach((arrItem, arrIndex) => {
        if (isPlainObject(arrItem)) {
          result[arrIndex] = assignDeep(result[arrIndex]);
        } else {
          result[arrIndex] = arrItem;
        }
      });
    }
  });
  return result;
};

// 浏览器标签页是否激活
export const browserTabActive = callback => {
  let hiddenProperty =
    'hidden' in document
      ? 'hidden'
      : 'webkitHidden' in document
        ? 'webkitHidden'
        : 'mozHidden' in document
          ? 'mozHidden'
          : '';
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

// 获取数组深度
export const getArrayDepth = arr => {
  let depth = 1;
  let loopDepth = arr => {
    arr.forEach(item => {
      Object.values(item).forEach(c => {
        if (Array.isArray(c)) {
          depth += 1;
          loopDepth(c);
        }
      });
    });
  };
  loopDepth(arr);
  return depth;
};

/**
 * @description 设置页面css变量
 * @param {string} name
 * @param {string} value
 */
export const setStyleProperty = (name, value) => {
  let html = document.querySelector('html');
  html.style.setProperty(`--${name}`, value);
};

/**
* @description 判断是否是IE

* @return {*} {boolean}

*/
export const isIE = () => {
  if (!!window.ActiveXObject || 'ActiveXObject' in window) {
    return true;
  } else {
    return false;
  }
};

// import CryptoJS from 'crypto-js';
// /**
//  * @description 加密
//  * @param {string} data
//  * @param {string} [key=默认加密密钥]
//  * @returns {string} base64格式的密文
//  */
// export const encrypt = (data: string, key = '123456789asdfghq'): string => {
//   let keys = CryptoJS.enc.Utf8.parse(key);
//   let encrypted = CryptoJS.AES.encrypt(data, keys, {
//     mode: CryptoJS.mode.ECB,
//     padding: CryptoJS.pad.Pkcs7,
//   });
//   return encrypted.toString();
// };

/**
 * @description 异步-截流
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
        status: 303,
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
 * @description 异步-防抖
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
    let arr = new Promise((resolve, reject) => {
      if (timer) {
        // 释放上次的队列
        clearTimeout(timer);
        timer = null;
        // 释放上次的promise
        rj({
          data: null,
          status: 303,
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

// import day from '@/theme/day';
// import night from '@/theme/night';
// /**
//  * @description 切换主题
//  * @author hys
//  * @date 2020-01-15
//  * @param {string} theme
//  */
// export const switchTheme = (theme: string): void => {
//   // 获取主题变量存储位置
//   let wt: any = document.querySelector('#ThemeVariate');
//   let sv: CSSStyleSheet = wt.styleSheet || wt.sheet;
//   // 获取最新变量集合
//   let val = theme === 'day' ? day : night;
//   // 删除页面中已存在的规则
//   let svl: number = sv.cssRules.length;
//   if (svl !== 0) {
//     sv.deleteRule(0);
//   }
//   // 循环变量集合组成新规则
//   let insertBody: String = '';
//   for (let [key, idx] of Object.entries(val)) {
//     insertBody += `--${key}: ${idx};`;
//   }
//   // 将新规则插入到变量存储位置
//   sv.insertRule(`html{${insertBody}}`);
// };

// 判断设备并设置body
export const judgeDeviceBody = () => {
  let body = document.querySelector('body');
  let setClass = res => {
    body.className = res;
  };
  if (judgePhone()) {
    // 手机访问
    setClass('mobile');
  } else {
    setClass('pc');
  }
};

/**
 * @description 页面滚动高度
 * @returns {number}
 */
export const getScrollTop = () => {
  let scrollTop = 0;
  let bodyScrollTop = 0;
  let documentScrollTop = 0;
  if (document.body) {
    bodyScrollTop = document.body.scrollTop;
  }
  if (document.documentElement) {
    documentScrollTop = document.documentElement.scrollTop;
  }
  scrollTop = bodyScrollTop - documentScrollTop > 0 ? bodyScrollTop : documentScrollTop;
  return scrollTop;
};

/**
 * @description 页面可视窗口高度
 * @returns {number}
 */
export const getClientHeight = () => {
  let windowHeight = 0;
  if (document.compatMode === 'CSS1Compat') {
    windowHeight = document.documentElement.clientHeight;
  } else {
    windowHeight = document.body.clientHeight;
  }
  return windowHeight;
};

/**
 * @description 页面内容高度
 * @returns {number}
 */
export const getDocumentHeight = () => {
  let scrollHeight = 0;
  let bodyScrollHeight = 0;
  let documentScrollHeight = 0;
  if (document.body) {
    bodyScrollHeight = document.body.scrollHeight;
  }
  if (document.documentElement) {
    documentScrollHeight = document.documentElement.scrollHeight;
  }
  scrollHeight = bodyScrollHeight - documentScrollHeight > 0 ? bodyScrollHeight : documentScrollHeight;
  return scrollHeight;
};

/**
 * @description 生成随机字符串(最多11位)
 * @param {number} num 需要返回字符数
 * @returns {string} 生成的字符
 */
export const randomString = num => {
  let str = Math.random().toString(36)
    .substr(2);
  return str.substr(0, num);
};

/**
 * 获取max与min之间的随机数
 *
 * @param {number} min
 * @param {number} max
 * @returns {*}
 * @example
 *
 * getRandomInt(1, 9);
 * // => 2
 */
export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


// import countries from './countries';
// /**
//  * @description 国家码转国家名称
//  * @param {string} code 国家码
//  * @returns {(string | void)} 国家名称
//  */
// export const countryCodeToName = code => {
//   if (!code) return '';
//   let arr = countries.concat();
//   let search = arr.filter((item, index) => {
//     return item.nationCode === code;
//   });
//   let first = search[0];
//   let name;
//   if (getLocale() === 'zh_CN') {
//     name = first.chinese;
//   } else {
//     name = first.english;
//   }
//   return name;
// };

// /**
//  * @description 国家码转国家对象信息
//  * @param {string} code 国家码
//  * @returns {(string | void)} 国家对象信息
//  */
// export const countryCodeToObj = code => {
//   if (!code)
//     return {
//       abbreviation: '',
//       chinese: '',
//       id: '',
//       nationCode: '86',
//       english: '',
//     };
//   let arr = countries.concat();
//   let search = arr.filter((item, index) => {
//     return item.nationCode === code;
//   });
//   return search[0];
// };

// import pako from 'pako';
// /**
//  * @description gzip解压缩
//  * @param {string} b64Data 压缩数据
//  * @returns {string} 生成的字符
//  */
// export const unzip = b64Data => {
//   if (!b64Data) return false;
//   let strData = atob(b64Data);
//   let charData = strData.split('').map(x => {
//     return x.charCodeAt(0);
//   });
//   let binData = new Uint8Array(charData);
//   let data = pako.inflate(binData);
//   strData = String.fromCharCode.apply(null, [...new Uint16Array(data)]);
//   return decodeURIComponent(strData);
// };

// /**
//  * @description 将压缩数据解压并拼接后返回
//  * @param {string[]} arr 压缩数据数组
//  * @returns {any[]} 解压后的数据数组
//  */
// export const zipToUnzip = arr => {
//   let unzipArr = '';
//   arr.forEach(item => {
//     unzipArr += unzip(item);
//   });
//   unzipArr = JSON.parse(unzipArr || '[]');
//   return unzipArr;
// };

/**
 * @description 禁止浏览器一些默认事件
 * @returns {void}
 */
export const disabledChromeDefault = () => {
  // 禁止选择
  document.onselectstart = () => {
    return false;
  };
  // 禁止复制
  document.oncopy = () => {
    return false;
  };
  // 禁止剪切
  document.oncut = () => {
    return false;
  };
  // 禁止粘贴
  document.onpaste = () => {
    return false;
  };
  // 禁止拖拽
  document.ondragstart = () => {
    return false;
  };
  // 禁止多功能键
  document.oncontextmenu = () => {
    return false;
  };
};

// 交易中订单倒计时国际标准时分秒 默认：(09:40:32)，isRight(09ˋ40′32″)
export const formatSeconds = (date, type, isRight = false) => {
  let marks = ':';
  let marks2 = '';
  if (isRight) {
    marks = '’';
    marks2 = '’’';
  }
  let formatTime = time => {
    let t = time;
    if (t < 10) {
      t = `0${(parseInt(t, 10), 10)}`;
    }
    return t;
  };

  const timeObj = formatDate(date);
  let { dayTime, hourTime, minuteTime, secondTime } = timeObj;
  let result = '';

  switch (type) {
    case 'OTC':
      result = `${secondTime / 10 < 1 ? 0 : ''}${parseInt(secondTime, 10)}${marks2}`;
      if (minuteTime > 0) {
        result = `${minuteTime / 10 < 1 ? 0 : ''}${parseInt(minuteTime, 10)}${marks}${result}`;
      } else {
        result = `00${marks}${result}`;
      }
      if (hourTime > 0) {
        result = `${hourTime / 10 < 1 ? 0 : ''}${parseInt(hourTime, 10)}${marks}${result}`;
      } else {
        result = `00${marks}${result}`;
      }
      break;
    default:
      result = `${formatTime(dayTime)}_${formatTime(hourTime)}_${formatTime(minuteTime)}_${formatTime(secondTime)}`;
      break;
  }
  return result;
};

/**
 * @description 价格简化
 * @param {number} price 价格
 * @param {number} fixed 小数位
 * @returns {string} 简化后的价格
 */
export const reducePrice = (price, fixed = 2) => {
  let arr = [];
  // 过滤替换
  let filterReplace = arr => {
    let res = `${price}`;
    // 排序倒序
    arr.sort((a, b) => {
      return b.price - a.price;
    });
    // 查找
    let find = arr.findIndex(item => {
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
  if (getLocale() === 'zh_CN') {
    arr = [
      {
        price: 10000,
        title: '万',
      },
      {
        price: 100000000,
        title: '亿',
      },
    ];
  } else {
    arr = [
      {
        price: 1000,
        title: 'K',
      },
      {
        price: 1000000,
        title: 'M',
      },
    ];
  }
  return filterReplace(arr);
};

// 获取国家标识
export const getLocale = () => {
  return 'zh_CN';
};

/**
 * @description 时间格式化
 * @param {(Date | undefined)} date 毫秒时间
 * @param {number} [time='123456'] 返回时间状态
 * @param {string} [symbol='/'] 日期间隔符
 * @param {string} [timeSymbol=':'] 时间间隔符
 * @returns {string}
 */
export const formatDate = (
  date,
  // 1年 2月 3日 4时 5分 6秒
  time = '123456',
  symbol = '/',
  timeSymbol = ':',
  UTC = false,
  // eslint-disable-next-line max-params
) => {
  if (!date || date === '--') return '--';
  let dateProcess = date;
  if (typeof dateProcess === 'string') {
    dateProcess = new Date(parseInt(dateProcess, 10));
  } else {
    dateProcess = new Date(dateProcess);
  }
  let year = dateProcess.getFullYear();
  let month = dateProcess.getMonth() + 1;
  let day = dateProcess.getDate();
  let hour = dateProcess.getHours();
  let minute = dateProcess.getMinutes();
  let second = dateProcess.getSeconds();
  if (UTC) {
    year = dateProcess.getUTCFullYear();
    month = dateProcess.getUTCMonth() + 1;
    day = dateProcess.getUTCDate();
    hour = dateProcess.getUTCHours();
    minute = dateProcess.getUTCMinutes();
    second = dateProcess.getUTCSeconds();
  }
  let formatNumber = n => {
    let t = n.toString();
    return t[1] ? t : `0${t}`;
  };
  let firstArr = [];
  let lastArr = [];
  let arr = time.toString().split('');
  let firstOver = false;
  let lastOver = false;
  arr.forEach(item => {
    switch (item) {
      case '1':
        firstArr.push(year);
        firstOver = true;
        break;
      case '2':
        firstArr.push(month);
        firstOver = true;
        break;
      case '3':
        firstArr.push(day);
        firstOver = true;
        break;
      case '4':
        lastArr.push(hour);
        lastOver = true;
        break;
      case '5':
        lastArr.push(minute);
        lastOver = true;
        break;
      case '6':
        lastArr.push(second);
        lastOver = true;
        break;
    }
  });
  if (arr.length > 3) {
    return `${firstArr.map(formatNumber).join(symbol)} ${lastArr.map(formatNumber).join(timeSymbol)}`;
  } else if (arr.length <= 3) {
    if (firstOver && lastOver) {
      return `${firstArr.map(formatNumber).join(symbol)} ${lastArr.map(formatNumber).join(timeSymbol)}`;
    }
    if (firstOver && !lastOver) {
      return `${firstArr.map(formatNumber).join(symbol)}`;
    }
    if (!firstOver && lastOver) {
      return `${lastArr.map(formatNumber).join(timeSymbol)}`;
    }
  }
  return '';
};

// 拦截全局input输入 并过滤数字
export const interceptInput = () => {
  document.addEventListener('input', e => {
    if (e.target.nodeName === 'INPUT') {
      let target = e.target;
      {
        let parent = target.parentNode;
        // 过滤浮点型数字
        let filterNumber = parent.className.split(' ').includes('filterNumber');
        if (filterNumber) {
          e.target.value = inputNumberFilter(e.target.value);
        }
        // 过滤整型数字
        let filterNumberInteger = parent.className.split(' ').includes('filterNumberInteger');
        if (filterNumberInteger) {
          e.target.value = inputNumberFilter(e.target.value, 0);
        }
      }
    }
  });
};

/**
 * @description 数字输入过滤 可指定输入小数位
 * @author hys
 * @date 11/11/2020
 * @params [res] Number 目标数字
 * @params [fixed] Number 小数位
 * @params [maxLen] Number 整数位
 */
export const inputNumberFilter = (res, fixed = 8, maxLen) => {
  let val = res.toString();
  // 非数字
  val = val.replace(/[^\d.]/g, '');
  // 小数点开头
  val = val.replace(/^\./g, '');
  // 连续小数点
  val = val.replace(/(\.+)/g, '.');
  // 开头多个零
  val = val.replace(/^(0+)/g, '0');
  // 非浮点类型的开头零
  val = val.replace(/^(0)([^.]+)/g, '$2');
  // 多个小数点
  val = val.replace(/(\.)([^.]+)(\.+)/g, '$1$2');
  // 处理
  let arr = val.split('.');
  // 处理整数位
  if (maxLen) {
    arr[0] = arr[0].substr(0, maxLen);
  }
  // 处理小数位
  if (fixed > 0) {
    if (arr[1]) {
      arr[1] = arr[1].substr(0, fixed);
      val = arr.join('.');
    }
  } else if (fixed === 0) {
    val = arr.join('.');
    val = Number(val).toString();
  }
  return val;
};

/**
 * @description 获取cookie
 */
export const getCookie = name => {
  let reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
  let arr = document.cookie.match(reg);
  if (arr) {
    return unescape(arr[2]);
  } else {
    return '';
  }
};

/**
 * @description 设置cookie
 */
// eslint-disable-next-line max-params
export const setCookie = (name, value, expired = 24 * 60 * 60 * 1000, domain) => {
  let exudate = new Date();
  exudate.setDate(exudate.getTime() + expired);
  document.cookie = `${name}=${escape(value)};expires=${exudate.toUTCString()};${domain ? `domain=${domain}` : ''}`;
};

/**
 * @description 删除cookie
 */
export const clearCookie = name => {
  setCookie(name, '', -1);
};

/**
 * @description 模糊匹配获取cookie
 */
export const matchCookie = name => {
  let reg = new RegExp(`(^| )${name}([^=]*)=([^;]*)(;|$)`, 'g');
  let arr = document.cookie.match(reg);
  if (arr) {
    return arr.map(item => {
      let a = item.slice(1, -1).split('=');
      a[1] = decodeURIComponent(a[1]);
      return a;
    });
  } else {
    return null;
  }
};

/**
 * @description 获取domain
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
  return '';
};

// 深度循环对象 处理科学记数法问题
export const deepObjectToNumber = res => {
  if (res) {
    let loop = r => {
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


// import axios from 'axios';
// import { Toast } from 'vant';
// import { Message } from 'element-ui';
// import qs from 'qs';
// axios process
// eslint-disable-next-line max-params
// export const http = (type, url, params, configs = {}) => {
//   if (type === 'get' && params) {
//     url = `${url}?${qs.stringify(params, { arrayFormat: 'indices' })}`;
//     params = {};
//   }
//   let config = {
//     ...configs,
//   };
//   if (type === 'file') {
//     type = 'post';
//     let formdata = new FormData();
//     for (let [key, value] of Object.entries(params)) {
//       formdata.append(key, value);
//     }
//     params = formdata;
//     config = {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//       ...configs,
//     };
//   }
//   let response = axios[type](url, params, config);
//   let thenCallback = () => {};
//   let thenAllCallback = () => {};
//   let catchCallback = () => {};
//   let allCallback = () => {};
//   response
//     .then(res => {
//       if (res.code === 200) {
//         thenCallback(res);
//       }
//       if (res.code === 0) {
//         if (judgePhone()) {
//           Toast(res.msg);
//         } else {
//           Message.info(res.msg);
//         }
//       }
//       thenAllCallback(res);
//       allCallback(res);
//     })
//     .catch(res => {
//       console.error(`[ catch ](${url})`, res);
//       catchCallback(res);
//       allCallback();
//     });
//   return {
//     then(callback) {
//       thenCallback = callback;
//       return this;
//     },
//     thenAll(callback) {
//       thenAllCallback = callback;
//       return this;
//     },
//     catch(callback) {
//       catchCallback = callback;
//     },
//     all(callback) {
//       allCallback = callback;
//     },
//   };
// };
