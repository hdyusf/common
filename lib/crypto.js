import CryptoJS from 'crypto-js';

/**
 * @description: arrayBuffer转换wordArray
 * @param {arrayBuffer}
 * @return {wordArray}
 */
export const ArrayBufferToWordArray = (arrayBuffer) => {
  const u8 = new Uint8Array(
    arrayBuffer,
    0,
    arrayBuffer.byteLength,
  );
  const len = u8.length;
  const words = [];
  for (let i = 0; i < len; i += 1) {
    words[i >>> 2] |= (u8[i] & 0xff) << (24 - (i % 4) * 8);
  }
  return CryptoJS.lib.WordArray.create(words, len);
};

/**
 * @description: wordArray转换arrayBuffer
 * @param {wordArray}
 * @return {arrayBuffer}
 */
export const WordArrayToArrayBuffer = (wordArray) => {
  const { words } = wordArray;
  const { sigBytes } = wordArray;
  const u8 = new Uint8Array(sigBytes);
  for (let i = 0; i < sigBytes; i += 1) {
    const byte =
      (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    u8[i] = byte;
  }
  return u8;
};

/**
 * @description: 加密arrayBuffer
 * @param {arrayBuffer} 需要加密的数据
 * @param {string} 加密密钥
 * @param {string}
 * @return {arrayBuffer} 加密后的数据
 */
export const encryptArrayBuffer = (
  data,
  key = '30980f98296b77f00a55f3c92b35322d898ae2ffcdb906de40336d2cf3d556a0',
  iv = 'e5889166bb98ba01e1a6bc9b32dbf3e6',
) => {
  data = ArrayBufferToWordArray(data);
  const bKey = CryptoJS.enc.Hex.parse(key);
  const bIv = CryptoJS.enc.Hex.parse(iv);
  const encrypt = CryptoJS.AES.encrypt(data, bKey, {
    iv: bIv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  const arrayBuffer = WordArrayToArrayBuffer(
    encrypt.ciphertext,
  );
  return arrayBuffer;
};

/**
 * @description: 解密arrayBuffer
 * @param {arrayBuffer} 需要解密的数据
 * @param {string} 解密密钥
 * @param {string}
 * @return {arrayBuffer} 解密后的数据
 */
export const decryptArrayBuffer = (
  data,
  key = '30980f98296b77f00a55f3c92b35322d898ae2ffcdb906de40336d2cf3d556a0',
  iv = 'e5889166bb98ba01e1a6bc9b32dbf3e6',
) => {
  data = ArrayBufferToWordArray(data);
  const bKey = CryptoJS.enc.Hex.parse(key);
  const bIv = CryptoJS.enc.Hex.parse(iv);
  const decrypt = CryptoJS.AES.decrypt(
    { ciphertext: data },
    bKey,
    {
      iv: bIv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    },
  );
  const arrayBuffer = WordArrayToArrayBuffer(decrypt);
  return arrayBuffer;
};

/**
 * @description: 加密string
 * @param {string} 数据
 * @param {string} 密钥
 * @return {string}
 */
export const encrypt = (data, key) => {
  var encrypted = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(data),
    key,
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    },
  );
  return encrypted.toString();
};

/**
 * @description: 解密string
 * @param {string} 数据
 * @param {string} 密钥
 * @return {string}
 */
export const decrypt = (data, key) => {
  let decrypted = CryptoJS.AES.decrypt(data, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return CryptoJS.enc.Utf8.stringify(decrypted);
};

/**
 * @description: 加密文件
 * @param {files} 需要加密的文件
 * @param {string} 加密令牌
 * @return {files} 加密后的文件
 */
export const encryptFile = async (files, key) => {
  return await encryptAndDecryptFileProcess(
    encrypt,
    files,
    key,
  );
};

/**
 * @description: 解密文件
 * @param {files} 需要解密的文件
 * @param {string} 解密令牌
 * @return {files} 解密后的文件
 */
export const decryptFile = async (files, key) => {
  return await encryptAndDecryptFileProcess(
    decrypt,
    files,
    key,
  );
};

/**
 * @description: 加密文件
 * @param {function} 操作函数
 * @param {files} 需要加密的文件
 * @param {string} 加密令牌
 * @return {files} 加密后的文件
 */
const encryptAndDecryptFileProcess = (type, files, key) => {
  return new Promise((resolve, reject) => {
    let blobSlice =
      File.prototype.slice ||
      File.prototype.mozSlice ||
      File.prototype.webkitSlice;
    let file = files,
      chunkSize = 2097152,
      chunks = Math.ceil(file.size / chunkSize),
      currentChunk = 0,
      bufferArray = [],
      fileReader = new FileReader();

    fileReader.onload = async function (e) {
      let aa = type(e.target.result, key);
      bufferArray.push(aa);
      currentChunk++;
      if (currentChunk < chunks) {
        loadNext();
      } else {
        let res = new File(bufferArray, file.name, {
          type: file.type,
        });
        resolve(res);
      }
    };

    fileReader.onerror = function () {
      console.log('oops, something went wrong.');
    };

    function loadNext() {
      let start = currentChunk * chunkSize,
        end =
          start + chunkSize >= file.size
            ? file.size
            : start + chunkSize;
      fileReader.readAsArrayBuffer(
        blobSlice.call(file, start, end),
      );
    }
    loadNext();
  });
};
