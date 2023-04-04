if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  const { generateHMACRawKey } = await import("./testingUtil");
  const rawKey = await generateHMACRawKey();
  test("", async () => {
    const { issueToken, getPayload } = await message(rawKey);
    const payload = {
      prop1: "string",
      prop2: -1,
      prop3: true,
    };
    const date = new Date();

    const token = await issueToken(payload, date);
    expect(await getPayload(token, date)).toEqual(payload);
    await expect(getPayload(token + ".", date)).rejects.toThrowError(
      "InvalidSignature"
    );

    const expired = new Date(date.getTime() + 1);
    await expect(getPayload(token, expired)).rejects.toThrowError("Expired");
  });
}

import { hmac } from "./hmac";

export async function message(secret: ArrayBufferLike) {
  const { digest, verify } = await hmac(secret);

  async function issueToken(payload: any, expires: Date) {
    const exp = String(expires.getTime());
    const val = JSON.stringify(payload);
    const msg = `${exp}.${val}`;
    const rawSign = await digest(new TextEncoder().encode(msg));
    const sign = self.btoa(String.fromCharCode(...new Uint8Array(rawSign)));
    return `${sign}.${msg}`;
  }

  async function getPayload(token: string, now: Date) {
    const [sign, msg] = splitN(token, ".", 2);
    const rawSign = new Uint8Array(
      (function* (s) {
        for (let i = 0, len = s.length; i < len; i++) {
          yield s.charCodeAt(i);
        }
      })(self.atob(sign))
    );
    if (!(await verify(rawSign, new TextEncoder().encode(msg)))) {
      throw new Error("SessionInvalidSignatureError");
    }

    const [exp, payload] = splitN(msg, ".", 2);

    if (new Date(Number(exp)) < now) {
      throw new Error("SessionExpiredError");
    }

    return JSON.parse(payload);
  }

  return { issueToken, getPayload } as const;
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
