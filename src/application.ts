export interface CfEnv {
  PUBLIC_KEY: string;
  HMAC_KEY: string;
  CMD_ECHO: string;
  CMD_POST: string;
  CMD_ISSUE: string;
}

import defaultHandler from "./handlers/default";
import postHandler from "./handlers/post";
import echoHandler from "./handlers/echo";
import issueHandler from "./handlers/issue";

import { Buffer } from "node:buffer";
import { message } from "./message";

export async function application(env: CfEnv) {
  const key = await crypto.subtle.importKey(
    "raw",
    Buffer.from(env.PUBLIC_KEY, "hex"),
    { name: "NODE-ED25519", namedCurve: "NODE-ED25519" },
    false,
    ["verify"]
  );

  const secret = Buffer.from(env.HMAC_KEY, "hex");
  const { makeReturnEnvelope, getJSON } = await message(secret);

  const routes = new Map<
    string,
    (interaction: any, env: any) => Promise<any>
  >();
  (env.CMD_ECHO ?? "").split(",").map((id) => routes.set(id, echoHandler));
  (env.CMD_POST ?? "").split(",").map((id) => routes.set(id, postHandler));
  (env.CMD_ISSUE ?? "").split(",").map((id) => routes.set(id, issueHandler));

  async function processAppCmd(interaction: { data: unknown }) {
    const data = interaction.data as { id: string };
    const handler = routes.get(data.id) ?? defaultHandler;
    const json = await handler(interaction, { makeReturnEnvelope, getJSON });
    return new Response(json, {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
  }
  return { key, processAppCmd };
}
