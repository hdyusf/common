import {
  toFixed,
  toNumber,
  inputNumberFilter,
} from '../lib/number';

test('toFixed', () => {
  expect(toFixed(123456.123456, 4, true)).toBe('123456.1234');
});

test('toNumber', () => {
  expect(toNumber(2.2e-7)).toBe(0.00000022);
});

test('inputNumberFilter', () => {
  expect(inputNumberFilter(123456.123456, 2)).toBe(
    '123456.12',
  );
});
