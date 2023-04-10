if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  const { Buffer } = await import("node:buffer");
  const public_key =
    "2a64ff64c5e9ce58bf38faf13cc6153699717b7d88713087758a9688f06ef471";
  const timestamp = "1646696920";
  const message = "Hello World";
  const signature =
    "e2815eedc16cfd9edf9f97b7721238e7e5349c253d9f8a849ef330666c99516d8389e4bb171c85e840c2cb1d79f21946734127b6f6faf618fc83dbf78b3f4105";

  const key = await crypto.subtle.importKey(
    "raw",
    Buffer.from(public_key, "hex"),
    { name: "NODE-ED25519", namedCurve: "NODE-ED25519" },
    false,
    ["verify"]
  );

  test("verifyRequestSignature", async () => {
    const sign = Buffer.from(signature, "hex");

    const ts = Buffer.from(timestamp);

    const body = Buffer.from(message);

    const data = Buffer.concat([ts, body]);
    const data2 = new Uint8Array(ts.byteLength + body.byteLength);
    data2.set(ts, 0);
    data2.set(body, ts.byteLength);
    expect(Buffer.compare(data, data2));

    const result = await crypto.subtle
      .verify(
        // miniflareでは namedCurveプロパティが必要っぽい
        { name: "NODE-ED25519", namedCurve: "NODE-ED25519" } as any,
        key,
        sign,
        data
      )
      .catch();

    expect(result).toBe(true);
  });
}

import { Buffer } from "node:buffer";

export enum InteractionType {
  PING = 1,
  APPLICATION_COMMAND = 2,
}

export enum InteractionCallbackType {
  PONG = 1,
  CHANNEL_MESSAGE_WITH_SOURCE = 4,
  DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
  DEFERRED_UPDATE_MESSAGE,
  UPDATE_MESSAGE,
  APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
  MODAL,
}

export async function verifyRequestSignature(req: Request, key: CryptoKey) {
  const sign = Buffer.from(req.headers.get("x-signature-ed25519") ?? "", "hex");
  const ts = Buffer.from(req.headers.get("x-signature-timestamp") ?? "");

  const body = new Uint8Array(await req.arrayBuffer());
  const data = Buffer.concat([ts, body]);

  let result = await crypto.subtle
    .verify({ name: "NODE-ED25519" }, key, sign, data)
    .catch((err) => console.log("verify error", JSON.stringify(err)));

  return result;
}
