import { hexToBytes } from "./stringUtils";

export interface CfEnv {
  PUBLIC_KEY: string;

  CMD_ECHO: string;
  CMD_POST: string;
}

import defaultHandler from './handlers/default';
import postHandler from './handlers/post';
import echoHandler from './handlers/echo';

export async function environment(env: CfEnv) {
  const key = await crypto.subtle.importKey(
    "raw",
    hexToBytes(env.PUBLIC_KEY),
    { name: "NODE-ED25519", namedCurve: "NODE-ED25519" },
    false,
    ["verify"]
  );

  const routes = new Map<string, (_: any) => Promise<any>>();
  (env.CMD_ECHO ?? "").split(",").map(id => routes.set(id, echoHandler));
  (env.CMD_POST ?? "").split(",").map(id => routes.set(id, postHandler));

  async function processAppCmd(interaction: { data: any }) {
    const data = interaction.data as { id: string };
    const handler = routes.get(data.id) ?? defaultHandler;
    return await handler(interaction);
  }
  return { key, processAppCmd };
}


