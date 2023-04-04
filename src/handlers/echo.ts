export default async function echoHandler(interaction: any) {
  const content = JSON.stringify(interaction);
  return { type: 4, data: { content } };
}
