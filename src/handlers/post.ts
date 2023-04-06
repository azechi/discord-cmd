export default async function postHandler(
  interaction: any,
  { _getPayload }: any
) {
  const token = interaction.data.options[0].value;
  console.log("postHandler------------");
  //console.log(`token = ${token}`)
  console.log(`token = ${token}`);
  console.log(`payload = ${JSON.stringify(JSON.parse(token))}`);
  const data = token;

  return `{"type":4,"data":${data}}`;
}
