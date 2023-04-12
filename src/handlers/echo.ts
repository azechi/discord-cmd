export default async function echoHandler(interaction: any) {
  if (!interaction.data.options) {
    const payload = {
      content: ':beer:\n```ts\nconsole.log("hello");\n````test`__test__',
    };

    let str_payload = JSON.stringify(payload).replaceAll("`", "\\u0060");
    console.log(`    str_payload\n---------------------`);
    console.log(`[${str_payload}]`);
    console.log(`-----------------------------------------------`);

    const str_msg = JSON.stringify("`` `" + str_payload + "` ``");

    return `{"type": 4, "data": {"embeds": [{"description": ${str_msg}}] }}`;
  }

  const s = interaction.data.options[0].value;
  console.log(`    loptions[0].value\n---------------------`);
  console.log(`[${s.slice(1, -1)}]`);
  console.log(`-----------------------------------------------`);
  const data = s.slice(1, -1);
  return `{"type": 4, "data": ${data}}`;
}
