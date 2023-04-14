export default async function issueHandler(
  interaction: any,
  { makeReturnEnvelope }: any
) {
  const msg = interaction.data.resolved.messages[interaction.data.target_id];
  const {
    content,
    embeds,
    author,
    channel_id,
    timestamp,
    edited_timestamp,
    id: message_id,
  } = msg;

  const { guild_id } = interaction;
  const { id: user_id, avatar: avatar_hash } = author;

  const payload = {
    type: 4,
    data: {
      embeds: [
        {
          color: 0x4e5058,
          thumbnail: {
            url: `https://cdn.discordapp.com/avatars/${user_id}/${avatar_hash}.png`,
          },
          description: `https://discord.com/channels/${guild_id}/${channel_id}/${message_id}\n<@${user_id}>\n\n${content}`,
          footer: {
            text: edited_timestamp ? "(編集済み)" : "",
          },
          timestamp: edited_timestamp ?? timestamp,
        },
        ...embeds,
      ],
    },
  };

  const token = await makeReturnEnvelope(
    payload,
    new Date(Date.now() + 1000 * 60 * 15)
  );
  return JSON.stringify({
    type: 4,
    data: {
      content: "</post:1094172109409898556>",
      embeds: [{ description: token }],
      flags: 1 << 6,
    },
  });
}
