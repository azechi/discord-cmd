import { hexToBytes } from "./stringUtils";

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

import {message} from "./message";


export async function environment(env: CfEnv) {
  const key = await crypto.subtle.importKey(
    "raw",
    hexToBytes(env.PUBLIC_KEY),
    { name: "NODE-ED25519", namedCurve: "NODE-ED25519" },
    false,
    ["verify"]
  );

  const secret = hexToBytes(env.HMAC_KEY);
  const {issueToken, getPayload} = await message(secret);

  const routes = new Map<string, (interaction: any, env: any) => Promise<any>>();
  (env.CMD_ECHO ?? "").split(",").map((id) => routes.set(id, echoHandler));
  (env.CMD_POST ?? "").split(",").map((id) => routes.set(id, postHandler));
  (env.CMD_ISSUE ?? "").split(",").map((id) => routes.set(id, issueHandler));

  async function processAppCmd(interaction: { data: unknown }) {
    const data = interaction.data as { id: string };
    const handler = routes.get(data.id) ?? defaultHandler;
    const json =  await handler(interaction, {issueToken, getPayload});
    return new Response(json, {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
  }
  return { key, processAppCmd };
}

