/**
 * @description:获取设备像素比
 * @return {number}
 * window.navigator.appVersion(5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1)
 * getPixelRatio(); => 2
 */
export const getPixelRatio = () => {
  let canvas = document.createElement('canvas');
  console.log('[ canvas ]', canvas);
  if (canvas) {
    const ctx = canvas.getContext('2d');
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
};

/**
 * @description:获取浏览器的类型和版本号
 * @return {object} { type: string, version: string }
 */
export const getBrowser = () => {
  const ua = navigator.userAgent.toLowerCase();
  let type = 'UNKNOW';
  let v;
  const check = function (regex) {
    return regex.test(ua);
  };

  // IE
  if (check(/msie/) && !check(/opera/)) {
    type = 'ie';
    v = /msie[/|\s]*([\d+?.?]+)/.exec(ua);
  } else if (
    !check(/webkit/) &&
    check(/gecko/) &&
    check(/firefox/) &&
    !check(/opera/)
  ) {
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
    v =
      /version[/|\s]*([\d+?.?]+)/.exec(ua) ||
      /opera[/|\s]*([\d+?.?]+)/.exec(ua);
  }

  return {
    type: type,
    version: v && v[1] ? v[1] : 'UNKNOW',
  };
};
