export default async function issueHandler(
  interaction: any,
  { makeReturnEnvelope }: any
) {
  const msg = interaction.data.resolved.messages[interaction.data.target_id];

  const { content, embeds } = msg;

  const payload = {
    type: 4,
    data: {
      content,
      embeds,
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
