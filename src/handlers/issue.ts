export default async function issueHandler(
  interaction: any,
  { issueToken }: any
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

  const token = await issueToken(
    payload,
    new Date(Date.now() + 1000 * 60 * 15)
  );
  return JSON.stringify({
    type: 4,
    data: {
      content: token,
    },
  });
}
