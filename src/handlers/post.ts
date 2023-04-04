export default async function postHandler(interaction: any) {
  console.log("postHandler");
  const token = interaction.data.options[0].value;
  const embeds = JSON.parse(token);

  return {
    type: 4,
    data: {
      embeds,
    },
  };
}
