/**
 * @description: 处理数字小数位
 * @param {number} 数值
 * @param {number} 小数位
 * @param {boolean} 不足小数位的强制补位0
 * @param {boolean} 是否四舍五入
 * @return {string}
 */
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

/**
 * @description: 乘法函数
 * @param {number}
 * @param {number}
 * @return {number}
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
 * @description: 加法函数
 * @param {number}
 * @param {number}
 * @return {number}
 */
export const accAdd = (arg1, arg2) => {
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
};

/**
 * @description: 除法函数
 * @param {number}
 * @param {number}
 * @return {number}
 */
export const accDiv = (arg1, arg2) => {
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
};

/**
 * @description: 减法函数
 * @param {number}
 * @param {number}
 * @return {number}
 */
export const accSub = (arg1, arg2) => {
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
};

/**
 * @description: 科学记数法转换
 * @param {number}
 * @return {number}
 */
export const toNumber = (num) => {
  // 处理非数字
  if (isNaN(num)) return num;

  // 处理不需要转换的数字
  if (!/e/i.test(num.toString())) return num;

  return Number(num.toFixed(18).replace(/\.?0+$/, ''));
};

/**
 * @description: 数字输入过滤 可指定输入小数位
 * @param {number} 目标数字
 * @param {Number} 小数位
 * @param {Number} 整数位最大长度
 * @return {string} 返回string格式是为了避免小数点无法输入(12. 在数字格式化时会清除小数点)
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
 * @description: 设置指定class 拦截全局input输入 并过滤数字
 * @return {void}
 */
export const interceptInput = () => {
  document.addEventListener('input', (e) => {
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
