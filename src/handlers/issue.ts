import { InteractionCallbackType } from "../discord";

export default async function issueHandler(
  interaction: any,
  { _issueToken }: any
) {
  //console.log(JSON.stringify(interaction.data, null, 2));

  const msg = interaction.data.resolved.messages[interaction.data.target_id];
  //console.log(JSON.stringify(msg, null, 2));
  console.log(`issueHandler ------------`);
  console.log(`content: ${msg.content}`);
  console.log(`embeds: ${msg.embeds}`);
  console.log(`-------------issueHandler`);

  const content = msg.content.replaceAll(":", "\\\\u003a");

  return `{"type":${InteractionCallbackType.CHANNEL_MESSAGE_WITH_SOURCE},"data":{"content":"${content}"}}`;
}
