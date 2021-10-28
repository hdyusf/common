import { getArrayDepth } from '../lib/array';

test('getArrayDepth', () => {
  let arr = [1, [2, [3], 4], 5, 6];
  expect(getArrayDepth(arr)).toBe(3);
});
