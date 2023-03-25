function hexToBin(s: string) {
  return new Uint8Array((s.match(/.{1,2}/g) ?? []).map((x) => parseInt(x, 16)));
}

interface Env {
  PUBLIC_KEY: string;
}

export default {
  async fetch(req: Request, env: Env, _context: ExecutionContext) {
    const key = await crypto.subtle.importKey(
      "raw",
      hexToBin(env.PUBLIC_KEY),
      { name: "NODE-ED25519", namedCurve: "NODE-ED25519" },
      false,
      ["verify"]
    );

    const sign = hexToBin(req.headers.get("x-signature-ed25519") ?? "");
    const ts = new TextEncoder().encode(
      req.headers.get("x-signature-timestamp") ?? ""
    );

    const body = new Uint8Array(await req.clone().arrayBuffer());
    const data = new Uint8Array(ts.byteLength + body.byteLength);
    data.set(ts, 0);
    data.set(body, ts.byteLength);

    let result = await crypto.subtle
      .verify({ name: "NODE-ED25519" }, key, sign, data)
      .catch((err) => console.log("verify error", JSON.stringify(err)));

    console.log(
      await req
        .json()
        .catch((_) => req.text())
        .catch((_) => new TextDecoder().decode(body))
    );

    if (result) {
      return new Response(
        JSON.stringify({
          type: 1,
        }),
        {
          status: 200,
        }
      );
    }

    return new Response(null, {
      status: 401,
      statusText: "invalid request signature",
    });
  },
};
