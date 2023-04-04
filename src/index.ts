function hexToBin(s: string) {
  return new Uint8Array((s.match(/../g) ?? []).map((x) => parseInt(x, 16)));
}

interface Env {
  PUBLIC_KEY: string;
}

export default {
  async fetch(req: Request, env: Env, _context: ExecutionContext) {
    console.log(env.PUBLIC_KEY);
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

    if (!result) {
      return new Response(null, {
        status: 401,
        statusText: "invalid request signature",
      });
    }

    const interaction = (await req
      .json()
      .catch((_) => req.text())
      .catch((_) => new TextDecoder().decode(body))) as {
      type: number;
      data: any;
    };

    console.log(interaction);

    if (interaction.type == 1) {
      return new Response(JSON.stringify({ type: 1 }), { status: 200 });
    }

    if (interaction.type == 2) {
      const cmdData = interaction.data;
      console.log(cmdData);
      console.log(cmdData.type);
      const o = JSON.stringify({
        type: 4,
        data: { content: "~𩸽にょろほっけ" },
      });
      console.log(o);
      return new Response(o, {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      });
    }

    return new Response(null, {
      status: 401,
      statusText: "invalid request signature",
    });
  },
};
