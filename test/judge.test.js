import {
  isPhoneMode,
  isEmailMode,
  isValidEmail,
  isLicenseNo,
  isCardId,
  isValidPassword,
  isValidURI,
} from '../lib/judge';

test('isPhoneMode', () => {
  expect(isPhoneMode(18530807222)).toBe(true);
});

test('isEmailMode', () => {
  expect(isEmailMode('hdsfax@163.com')).toBe(true);
});

test('isValidEmail', () => {
  expect(isValidEmail('hdsfax@163.com')).toBe(true);
});

test('isLicenseNo', () => {
  expect(isLicenseNo('浙A12345')).toBe(true);
});

test('isCardId', () => {
  expect(isCardId('410725199502189823')).toBe(true);
});

test('isValidPassword', () => {
  expect(isValidPassword('sdf123')).toBe(true);
});

test('isValidURI', () => {
  expect(
    isValidURI(
      'https://jestjs.io/zh-Hans/docs/using-matchers',
    ),
  ).toBe(true);
});
