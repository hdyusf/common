/**
 * @description: 750原型的px转换为vw
 * @param {number}
 * @return {string}
 */
export const pxToVw = (px) => {
  const ratio = 750 / 100;
  const vw = `${(px / ratio).toFixed(6)}vw`;
  return vw;
};

/**
 * @description: 750原型的px转换为屏幕的px
 * @param {number}
 * @return {string}
 */
export const pxToPxRatio = (px) => {
  const clientWidth = document.body.clientWidth || 375;
  const pxRatio = px * (clientWidth / 750);
  return pxRatio;
};

/**
 * @description: 750原型的px转换为屏幕的vw
 * @param {number}
 * @return {string}
 */
export const pxToVwRatio = (px) => {
  const clientWidth = document.documentElement.clientWidth || document.body.clientWidth || 375;
  const ratio = clientWidth / 100;
  const vw = `${(px / ratio).toFixed(6)}vw`;
  return vw;
};
