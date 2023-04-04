import { environment, CfEnv } from "./environment";
import { verifyRequestSignature, InteractionType } from "./discord";

export default {
  async fetch(req: Request, env: CfEnv, _context: ExecutionContext) {
    const { key, processAppCmd } = await environment(env);

    const verified = await verifyRequestSignature(req.clone(), key);
    console.log(`verified=${verified}`);

    if (!verified) {
      return new Response(null, {
        status: 401,
        statusText: "invalid request signature",
      });
    }

    const interaction = (await req.json()) as { type: number; data: any };

    switch (interaction.type) {
      case InteractionType.Ping:
        return new Response(JSON.stringify({ type: 1 }), { status: 200 });
      case InteractionType.APPLICATION_COMMAND:
        const result = await processAppCmd(interaction);
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        });
      default:
        throw "NOT IMPLEMENTED";
    }
  },
};
