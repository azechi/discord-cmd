import { hexToBytes } from "./stringUtils";

export enum InteractionType {
  PING = 1,
  APPLICATION_COMMAND = 2,
}

export async function verifyRequestSignature(req: Request, key: CryptoKey) {
  const sign = hexToBytes(req.headers.get("x-signature-ed25519") ?? "");
  const ts = new TextEncoder().encode(
    req.headers.get("x-signature-timestamp") ?? ""
  );

  const body = new Uint8Array(await req.arrayBuffer());
  const data = new Uint8Array(ts.byteLength + body.byteLength);
  data.set(ts, 0);
  data.set(body, ts.byteLength);

  let result = await crypto.subtle
    .verify({ name: "NODE-ED25519" }, key, sign, data)
    .catch((err) => console.log("verify error", JSON.stringify(err)));

  return result;
}
