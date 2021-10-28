/**
 * @description: 获取数组深度
 * @param {array}
 * @return {number}
 */
export const getArrayDepth = (array) => {
  let depth = 1;
  let loopDepth = (array) => {
    array.forEach((item) => {
      if (Array.isArray(item)) {
        depth += 1;
        loopDepth(item);
      }
    });
  };
  loopDepth(array);
  return depth;
};
