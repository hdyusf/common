/**
 * @jest-environment jsdom
 */

import {
  pxToVw,
  pxToPxRatio,
  pxToVwRatio,
} from '../lib/pxVw';

test('pxToVw', () => {
  expect(pxToVw(75)).toBe('10.000000vw');
});

test('pxToPxRatio', () => {
  expect(pxToPxRatio(100)).toBe(50);
});

test('pxToVwRatio', () => {
  expect(pxToVwRatio(100)).toBe('26.666667vw');
});
