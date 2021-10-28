import { codeToCountry, nameToCountry } from '../lib/country';

test('codeToCountry', () => {
  expect(codeToCountry(86)).toEqual({ shoupinyin: 'Z', en: 'China', zh: '中国', locale: 'CN', code: 86 });
});

test('nameToCountry', () => {
  expect(nameToCountry('中国')).toEqual({ shoupinyin: 'Z', en: 'China', zh: '中国', locale: 'CN', code: 86 });
});
