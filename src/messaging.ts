
if (import.meta.vitest) {
  const {test, expect} = import.meta.vitest;
  const {generateHMACRawKey} = await import('./testingUtil');
  const rawKey = await generateHMACRawKey();
  test('', async ()=> {
    const [issue, get] = await messaging(rawKey);
    const payload = {
      "prop1": "string",
      "prop2": -1,
      "prop3": true
    }
    const date = new Date();

    const token = await issue(payload, date);
    expect(await get(token, date)).toEqual(payload);
  })
}

import { hmac } from './hmac';

export async function messaging(secret: ArrayBufferLike) {
  const [digest, verify] = await hmac(secret);

  async function issueToken(payload: any, expires: Date) {
    const exp = String(expires.getTime());
    const val = JSON.stringify(payload);
    const msg = `${exp}.${val}`;
    const rawSign = await digest(new TextEncoder().encode(msg));
    const sign = self.btoa(String.fromCharCode(...new Uint8Array(rawSign)))
    return `${sign}.${msg}`
  };

  async function getPayload(token: string, now: Date) {
    const [sign, msg] = splitN(token, ".", 2);
    const rawSign =  new Uint8Array(
      (function* (s){
        for (let i = 0, len = s.length; i < len; i++) {
          yield s.charCodeAt(i);
        }
      })(self.atob(sign))
    );
    if (!(await verify(rawSign, new TextEncoder().encode(msg)))){
      throw new Error("SessionInvalidSignatureError");
    }

    const [exp, payload] = splitN(msg, ".", 2);

    if (new Date(Number(exp)) < now) {
      throw new Error("SessionExpiredError");
    }

    return JSON.parse(payload);
  }

  return [issueToken, getPayload] as const;
}


function splitN(s: string, sep: string, c: number) {
  const acm = [];
  let i = 0;
  let j;
  while (--c) {
    j = s.indexOf(sep, i);
    if (j === -1) {
      break;
    }

    acm.push(s.substring(i, j));
    i = j + sep.length;
  }
  acm.push(s.substring(i));
  return acm;
}



