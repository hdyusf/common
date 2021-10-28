import countries from './utils/countries';

let countryFilterProcess = (callback) => {
  let arr = countries.concat();
  let search = arr.filter((item) => {
    return callback(item);
  });
  return search[0];
};

/**
 * @description: 获取国家对象信息
 * @param {number} 国家码
 * @return {object} 国家对象信息
 */
export const codeToCountry = (code) => {
  if (!code) return '';
  return countryFilterProcess((item) => {
    return item.code === code;
  });
};

/**
 * @description: 获取国家对象信息
 * @param {string} 国家名称
 * @return {object} 国家对象信息
 */
export const nameToCountry = (name) => {
  if (!name) return '';
  return countryFilterProcess((item) => {
    return item.zh === name || item.en === name;
  });
};
