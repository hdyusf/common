import { isPhone } from './judge';

/**
 * @description:是否包含class
 * @param {element} dom元素
 * @param {string} class类名
 * @return {boolean}
 */
export const hasClass = (el, cls) => {
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
};

/**
 * @description:添加class
 * @param {element} dom元素
 * @param {string} class类名
 * @return {void}
 */
export const addClass = (el, cls) => {
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
};

const trim = function(string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
};

/**
 * @description:删除class
 * @param {element} dom元素
 * @param {string} class类名
 * @return {void}
 */
export const removeClass = (el, cls) => {
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
};

/**
 * @description:滚动到顶部
 * @return {void}
 */
export const scrollToTop = () => {
  const c = document.documentElement.scrollTop || document.body.scrollTop;

  if (c > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, c - c / 8);
  }
};

/**
 * @description:设置页面css变量
 * @param {string} 名称
 * @param {string} 值
 * @return {void}
 */
export const setStyleProperty = (name, value) => {
  let html = document.querySelector('html');
  html.style.setProperty(`--${name}`, value);
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

/**
 * @description: 在body上设置设备类型
 * @return {void}
 */
export const setBodyDevice = () => {
  let body = document.querySelector('body');
  if (isPhone()) {
    removeClass(body, 'pc');
    addClass(body, 'mobile');
  } else {
    removeClass(body, 'mobile');
    addClass(body, 'pc');
  }
};

/**
 * @description: 页面滚动高度
 * @return {number}
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
 * @description: 页面可视窗口高度
 * @return {number}
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
 * @description: 页面内容高度
 * @return {number}
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
 * @description: 禁止浏览器一些默认事件
 * @return {void}
 */
export const disabledChromeDefault = () => {
  document.onselectstart = () => {
    return false;
  };
  document.oncopy = () => {
    return false;
  };
  document.oncut = () => {
    return false;
  };
  document.onpaste = () => {
    return false;
  };
  document.ondragstart = () => {
    return false;
  };
  document.oncontextmenu = () => {
    return false;
  };
};

/**
 * @description: 复制内容方法
 * @param {string} 内容
 * @return {boolean}
 */
 export const copyContent = (string) => {
  const input = document.createElement('input');
  input.setAttribute('readonly', 'readonly');
  input.setAttribute('value', string);
  document.body.appendChild(input);
  input.select();
  input.setSelectionRange(0, 9999);
  const iscopy = document.execCommand('copy');
  document.body.removeChild(input);
  if (iscopy) {
    return true;
  }
  return false;
};
