/**
 * @description: 解析url
 * @param {string}
 * @return {object}
 */
export const parseUrl = (url) => {
  const a = document.createElement('a');
  a.href = url;
  return {
    source: url,
    protocol: a.protocol.replace(':', ''),
    host: a.hostname,
    port: a.port,
    query: a.search,
    params: (function() {
      const ret = {};
      const seg = a.search.replace(/^\?/, '').split('&');
      const len = seg.length;
      let i = 0;
      let s;
      for (; i < len; i++) {
        if (!seg[i]) {
          continue;
        }
        s = seg[i].split('=');
        ret[s[0]] = s[1];
      }
      return ret;
    })(),
    file: (a.pathname.match(/\/([^/?#]+)$/i) || ['', ''])[1],
    hash: a.hash.replace('#', ''),
    path: a.pathname.replace(/^([^/])/, '/$1'),
    relative: (a.href.match(/tps?:\/\/[^/]+(.+)/) || ['', ''])[1],
    segments: a.pathname.replace(/^\//, '').split('/')
  };
};
