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
    id,
  } = msg;

  const author2 = {
    name: author.username,
    //url: "",
    icon_url: `https://polybit-apps.s3.amazonaws.com/stdlib/users/discord/profile/image.png?1`,
    //proxy_icon_url: ""
  };

  const payload = {
    type: 4,
    data: {
      content: `message link:  https://discord.com/channels/${interaction.guild_id}/${channel_id}/${id}`,
      embeds: [
        {
          //title: "",
          description: content,
          timestamp: edited_timestamp ?? timestamp,
          author: author2,
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
      content: "</post:1091535901768822915>",
      embeds: [{ description: token }],
      flags: 1 << 6,
    },
  });
}
