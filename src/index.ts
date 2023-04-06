import { environment, CfEnv } from "./environment";
import { verifyRequestSignature, InteractionType } from "./discord";

export default {
  async fetch(req: Request, env: CfEnv, _context: ExecutionContext) {
    const { key, processAppCmd } = await environment(env);

    const verified = await verifyRequestSignature(req.clone(), key);

    if (!verified) {
      return new Response(null, {
        status: 401,
        statusText: "invalid request signature",
      });
    }

    const interaction = (await req.json()) as { type: number; data: any };

    switch (interaction.type) {
      case InteractionType.PING:
        return new Response(JSON.stringify({ type: 1 }), { status: 200 });
      case InteractionType.APPLICATION_COMMAND:
        return await processAppCmd(interaction);
      default:
        throw "NOT IMPLEMENTED";
    }
  },
};
