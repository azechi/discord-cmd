
export default async function postHandler(
  interaction: any,
  { getPayload }: any
) {
  const token = interaction.data.options[0].value;
  console.log("postHandler------------");
  console.log(`token = ${token}`);
  const payload = await getPayload(token, new Date());
  console.log(`payload = ${payload}`);
  return `{"type":4,"data":${payload}}`;
}
