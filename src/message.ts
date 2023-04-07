import { hmac } from "./hmac";

export async function message(secret: ArrayBufferLike) {
  const { sign, verify } = await hmac(secret);

  async function issueToken(payload: unknown, expires: Date) {
    const exp = String(expires.getTime());
    const val = JSON.stringify(payload);
    const msg = `${exp}.${val}`;
    const rawSignature = await sign(new TextEncoder().encode(msg));
    const signature = self.btoa(
      String.fromCharCode(...new Uint8Array(rawSignature))
    );

    const discordEncoded = JSON.stringify(payload, (_, v) => {
      if (typeof v === "string") {
        return JSON.stringify(v).slice(1, -1).replaceAll(":", "\\u003a");
      }
      return v;
    });

    return `${signature}.${exp}.${discordEncoded}`;
  }

  async function getJSON(token: string, now: Date) {
    const [signature, exp, val] = splitN(token, ".", 3);
    const rawSignature = new Uint8Array(
      (function* (s) {
        for (let i = 0, len = s.length; i < len; i++) {
          yield s.charCodeAt(i);
        }
      })(self.atob(signature))
    );

    const payload = JSON.stringify(JSON.parse(val));
    const msg = `${exp}.${payload}`;
    console.log(`message = ${msg}`);
    if (!(await verify(rawSignature, new TextEncoder().encode(msg)))) {
      throw new Error("SessionInvalidSignatureError");
    }

    if (new Date(Number(exp)) < now) {
      throw new Error("SessionExpiredError");
    }

    return payload;
  }

  return { issueToken, getJSON } as const;
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
