import { hexToBytes } from "./stringUtils";

export interface CfEnv {
  PUBLIC_KEY: string;

  CMD_ECHO: string;
}

export async function environment(env: CfEnv) {
  const key = await crypto.subtle.importKey(
    "raw",
    hexToBytes(env.PUBLIC_KEY),
    { name: "NODE-ED25519", namedCurve: "NODE-ED25519" },
    false,
    ["verify"]
  );

  console.log(`CMD_ECHO = ${env.CMD_ECHO}`);
  const routes = new Map<string, (_: any) => Promise<any>>();
  (env.CMD_ECHO ?? "").split(",").map((id) => routes.set(id, echoHandler));

  async function processAppCmd(interaction: { data: any }) {
    const data = interaction.data as { id: string };
    const handler = routes.get(data.id) ?? defaultHandler;
    return await handler(interaction);
  }
  return { key, processAppCmd };
}

async function defaultHandler(_: any) {
  return { type: 4, data: { content: "まだないんだわ" } };
}

async function echoHandler(interaction: any) {
  const content = JSON.stringify(interaction);
  return { type: 4, data: { content } };
}
