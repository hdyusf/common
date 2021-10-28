/**
 * @description: 关闭屏幕滚动
 * 简易版
 * 注意事项: 浮层定位需要使用fixed
 */
 export const closeScroll = () => {
  const body = document.querySelector('body');
  body.style.overflow = 'hidden';
};

/**
 * @description: 开启屏幕滚动
 * 简易版
 * 注意事项: 浮层定位需要使用fixed
 */
export const openScroll = () => {
  const body = document.querySelector('body');
  body.style.overflow = 'inherit';
};
