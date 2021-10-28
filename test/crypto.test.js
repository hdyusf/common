import { encrypt, decrypt } from '../lib/crypto';
import { randomString } from '../lib/string';

let str = randomString();
let key = randomString();

test('encrypt and decrypt', () => {
  let enStr = encrypt(str, key);
  let deStr = decrypt(enStr, key);
  expect(deStr).toBe(str);
});
