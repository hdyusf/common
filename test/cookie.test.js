/**
 * @jest-environment jsdom
 */

import { getCookie, setCookie, clearCookie, matchCookie, getDomain } from '../lib/cookie';

let name = 'jest';
let value = 'jestValue';

test('getCookie', () => {
  expect(getCookie(name)).toBe(undefined);
});

test('setCookie', () => {
  setCookie(name, value);
  expect(getCookie(name)).toBe(value);
});

test('clearCookie', () => {
  clearCookie(name);
  expect(getCookie(name)).toBe('');
});

test('matchCookie', () => {
  setCookie(name + 'aa', value);
  expect(matchCookie('aa')).toEqual({ jestaa: value });
});

test('getDomain', () => {
  expect(getDomain()).toBe('localhost');
});
