export default async function postHandler(
  interaction: any,
  { _getPayload }: any
) {
  const token = interaction.data.options[0].value;

  console.log(`postHandler--------------`);
  console.log(`option[0].value = ${token}`);
  console.log(`--------------postHandler`);

  const result = `{"type":4,"data":{"content":"${token}"}}`;
  return result;
}
