import { InteractionCallbackType } from "../discord";

export default async function issueHandler(
  interaction: any,
  { _issueToken }: any
) {
  const msg = interaction.data.resolved.messages[interaction.data.target_id];

  const { content, embeds } = msg;

  //console.log(JSON.stringify(msg, null, 2));
  //  console.log(`issueHandler ------------`);
  //  console.log(`content: ${content}`);
  //  for (const embed of embeds) {
  //    console.log(`embeds: ${JSON.stringify(embed, null, 2)}`);
  //  }

  function replacer(key: unknown, value: unknown) {
    //    console.log(`key[${key}] ${typeof value}`);
    if (typeof value === "string") {
      return value.replaceAll(":", "\\u003a");
    }
    return value;
  }

  //  const token =
  //    `{` +
  //    `"content":${JSON.stringify(content, replacer)},` +
  //    `"embeds":${JSON.stringify(embeds, replacer)}` +
  //    `}`;

  //  const escaped_token = JSON.stringify(token);

  //  console.log("token --------------------------")
  //  console.log(token);
  //  console.log("--------------------------");
  //  console.log(JSON.stringify(token));
  //  console.log("***************************");

  //  const result = `{"type":${
  //    InteractionCallbackType.CHANNEL_MESSAGE_WITH_SOURCE
  //  },"data":{"content": ${escaped_token}}}`;

  //  console.log(result);
  //  const tmp = JSON.parse(result);
  //  console.log(JSON.stringify(tmp, null, 2));

  //  console.log(`-------------issueHandler`);
  //return result;

  console.log(`issueHandler ---------------------`);
  const payload = `":beer:`;
  console.log(`payload = ${payload}`);
  const q = JSON.stringify(payload).slice(1, -1);
  //console.log(`json_encoded_content = ${q}`);
  const s = JSON.stringify({ content: q }, replacer);
  //console.log(`content object json = ${s}`);
  const encoded_content = JSON.stringify(s);
  //console.log(`encoded_content = ${encoded_content}`)
  //console.log(`----------issueHandler`)
  return `{"type":4,"data":{"content": ${encoded_content}}}`;
}
