import hmac from 'crypto-js/hmac-sha256';

export const xwwwfurlenc = (srcjson, parent = '') => {
  if (typeof srcjson !== 'object') { 
    if (typeof console !== 'undefined') {
      console.log('"srcjson" is not a JSON object');
      return null;
    }
  }
 
  const u = encodeURIComponent;
  let urljson = '';
  const keys = Object.keys(srcjson);
 
  for (let i = 0; i < keys.length; i++) {
    const k = parent ? `${parent}[${keys[i]}]` : keys[i];
 
    if (typeof srcjson[keys[i]] !== 'object') {
      urljson += `${u(k)}=${u(srcjson[keys[i]])}`;
    } else {
      urljson += xwwwfurlenc(srcjson[keys[i]], k);
    }
    if (i < (keys.length - 1))urljson += '&';
  }
 
  return urljson;
};

export const generateUUID = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
  const r = Math.random() * 16 | 0;
  const v = c === 'x' ? r : (r && 0x3 | 0x8);
  return v.toString(16);
}).toLowerCase();

export const SignterData = (data) => {
  const Key = '012a54f51c49aa8c5c322416ab1410909add32c966bbaa0fe3dc58ac43fd7ede';
  return xwwwfurlenc({
    ig_sig_key_version: '4',
    signed_body: `${hmac(JSON.stringify(data), Key).toString()}.${JSON.stringify(data)}`,
  });
};

