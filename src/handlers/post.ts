export default async function postHandler(interaction: any, {getPayload}: any) {
  const token = interaction.data.options[0].value;
  console.log(token);
  const embeds = await getPayload(token, new Date());
  console.log("postHandler embeds ----")
  console.log(JSON.stringify(embeds, null, 2));
  console.log("--------------------")

  return {
    type: 4,
    data: {
      embeds,
    },
  };
}
