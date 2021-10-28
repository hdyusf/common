import { getObjValue, deepAssign } from '../lib/object';

test('getObjValue', () => {
  var props = {
    user: {
      post: [
        {
          comments: 'test',
        },
      ],
    },
  };
  expect(
    getObjValue(['user', 'post', 0, 'comments'], props),
  ).toBe('test');
});

test('deepAssign', () => {
  let a = {
    a: 1,
    b: {
      c: 1,
      d: 2,
      e: {
        d: 1,
      },
    },
  };
  let b = {
    a: 2,
    b: {
      f: 1,
      d: 2,
      e: {
        n: 1,
      },
    },
  };
  expect(deepAssign(a, b)).toEqual({
    a: 2,
    b: { c: 1, d: 2, e: { d: 1, n: 1 }, f: 1 },
  });
});
