import {InteractionCallbackType} from '../discord';

export default async function issueHandler(interaction: any, {issueToken}: any) {
  //console.log(JSON.stringify(interaction.data.resolved, null, 2));

  const o = [{"type":"rich","description":"embed description:beer:","color":2853771,"author":{"name":"Autor","icon_url":"https://polybit-apps.s3.amazonaws.com/stdlib/users/discord/profile/image.png?1"}}];

  o[0].description = o[0].description.replaceAll(":", "\\" + "u003a");

  const token = await issueToken(o, new Date(Date.now() + 86400000));
  console.log(token)
  const s = token.replaceAll("/", "\\/");
  //console.log(s);

  return { 
    type: InteractionCallbackType.CHANNEL_MESSAGE_WITH_SOURCE, 
    data: { 
      content: s,
      flags: (1 << 6) + (1 << 2) //ephemeral + supress_embeds
    } 
  };
}
