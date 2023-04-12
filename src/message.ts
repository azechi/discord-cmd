import { hmac } from "./hmac";

export async function message(secret: ArrayBufferLike) {
  const { sign, verify } = await hmac(secret);

  async function makeReturnEnvelope(payload: unknown, expires: Date) {
    const exp = String(expires.getTime());
    const val = JSON.stringify(payload).replaceAll("`", "\\u0060");
    const msg = `${exp}.${val}`;
    const rawSig = await sign(new TextEncoder().encode(msg));
    const sig = self.btoa(String.fromCharCode(...new Uint8Array(rawSig)));

    return "`` `" + `${sig}.${msg}` + "` ``";
  }

  async function getJSON(envelope: string, now: Date) {
    const token = envelope.slice(1, -1);
    const [sig, exp, val] = splitN(token, ".", 3);
    const rawSig = new Uint8Array(
      (function* (s) {
        for (let i = 0, len = s.length; i < len; i++) {
          yield s.charCodeAt(i);
        }
      })(self.atob(sig))
    );

    const msg = `${exp}.${val}`;
    if (!(await verify(rawSig, new TextEncoder().encode(msg)))) {
      throw new Error("SessionInvalidSignatureError");
    }

    if (new Date(Number(exp)) < now) {
      throw new Error("SessionExpiredError");
    }

    return val;
  }

  return { makeReturnEnvelope, getJSON } as const;
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
