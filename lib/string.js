/**
 * @description: 生成随机字符串(最多11位)
 * @param {number} num 需要返回字符数
 * @return {string} 生成的字符
 */
export const randomString = (num) => {
  let str = Math.random()
    .toString(36)
    .substr(2);
  return str.substr(0, num);
};

/**
 * @description: 获取max与min之间的随机数
 * @param {number} min
 * @param {number} max
 * @return {*}
 * getRandomInt(1, 9);
 * => 2
 */
export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
