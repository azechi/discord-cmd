import { InteractionCallbackType } from "../discord";

export default async function issueHandler(
  interaction: any,
  { _issueToken }: any
) {
  const msg = interaction.data.resolved.messages[interaction.data.target_id];

  const { content, embeds } = msg;

  //console.log(JSON.stringify(msg, null, 2));
  console.log(`issueHandler ------------`);
  console.log(`content: ${content}`);
  for (const embed of embeds) {
    console.log(`embeds: ${JSON.stringify(embed, null, 2)}`);
  }
  console.log(`-------------issueHandler`);

  const token =
    `{` +
    `"content":"${content.replaceAll(":", "\\\\u003a")}",` +
    `"embeds":${JSON.stringify(embeds)}` +
    `}`;

  console.log(token);
  console.log("--------------------------");
  console.log(JSON.stringify(token));
  console.log("***************************");

  const result = `{"type":${
    InteractionCallbackType.CHANNEL_MESSAGE_WITH_SOURCE
  },"data":{"content": ${JSON.stringify(token)}}}`;

  console.log(result);
  const tmp = JSON.parse(result);
  console.log(JSON.stringify(tmp, null, 2));
  return result;
}
