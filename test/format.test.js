import {
  formatPriceUnit,
  formatPrice,
  formatPhone,
  formatBankCard,
  formatFileSize,
} from '../lib/format';

test('formatPriceUnit', () => {
  expect(formatPriceUnit(1000000000)).toBe('10亿');
});

test('formatPrice', () => {
  expect(formatPrice(1234567, 4, true)).toBe(
    '1,234,567.0000',
  );
});

test('formatPhone', () => {
  expect(formatPhone('15858264903')).toBe('158****4903');
});

test('formatBankCard', () => {
  expect(formatBankCard('6225365271562822')).toBe(
    '6225 3652 7156 2822',
  );
});

test('formatFileSize', () => {
  expect(formatFileSize('10000')).toBe('9.8 KB');
});