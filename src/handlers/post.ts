export default async function postHandler(interaction: any, { getJSON }: any) {
  const token = interaction.data.options[0].value;
  const json = await getJSON(token, new Date());
  return json;
}
