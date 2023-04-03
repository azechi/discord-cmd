import {messaging} from './messaging';

function hexToBin(s: string) {
  return new Uint8Array((s.match(/../g) ?? []).map((x) => parseInt(x, 16)));
}

interface Env {
  PUBLIC_KEY: string;

  CMD_POST: string;
  HMAC_KEY: string;
}

export default {
  async fetch(req: Request, env: Env, _context: ExecutionContext) {

    const [issueToken, getPayload] = await messaging(hexToBin(env.HMAC_KEY));

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

    console.log(JSON.stringify(interaction, null, 2));

    // type=1 PING
    if (interaction.type == 1) {
      return new Response(JSON.stringify({ type: 1 }), { status: 200 });
    }

    // type=2 APPLICATION COMMAND
    // "/post embed:string"
    if (interaction.type == 2 && interaction.data.id == env.CMD_POST) {
      console.log("/post")
      const value = interaction.data.options[0].value;
      console.log(value);
      const embed = JSON.parse(value);
      console.log(JSON.stringify(embed, null, 2));
      const body = {
        type: 4, //CHANNEL_MESSAGE_WITH_SOURCE
        data: {
          embeds: embed,
        },
      };
      //console.log(JSON.stringify(body, null, 2));
      return new Response(JSON.stringify(body), {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      });
    }

    throw("NOT IMPLEMENTED")

  },
};
