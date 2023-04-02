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

    if (new Date(Number(exp)) <= now) {
      throw new Error("SessionExpiredError");
    }

    return JSON.parse(payload);
  }

  return [issueToken, getPayload] as const;
}

async function hmac(rawKey: ArrayBufferLike) {
  const key = await crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "HMAC", hash: {name: "SHA-256"}},
    false,
    ["sign", "verify"]
  );

  const digest = (message: ArrayBufferLike) => {
    return crypto.subtle.sign("HMAC", key, message);
  };

  // safe-compare ?
  const verify = (digest: ArrayBufferLike, message: ArrayBufferLike) => {
    return crypto.subtle.verify("HMAC", key, digest, message);
  };

  return [digest, verify] as const;
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

