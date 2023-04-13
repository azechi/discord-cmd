export default async function echoHandler(interaction: any) {
  const s = "2024-03-25T02:47:23.958000+00:00";
  const date = new Date(s);
  const iso = date.toISOString();
  const ts = date.getTime();
  
  const parsed = Date.parse(s);
  const timestamp = Math.floor(parsed / 1000);

  return JSON.stringify({
    type: 4,
    data: {
      content: `content:<t:${timestamp}>`,
      embeds: [{
        color: `${parseInt("4e5058", 16)}`,
        title: `embed.title:<t:${timestamp}>`,
        description: `embed.description:<t:${timestamp}>`,
        timestamp: "2023-03-25T02:47:23.958000+00:00",
        fields: [{
          name: ``,
          value: `<t:${timestamp}:F>`,
          inline: false,
        },
        {
          name: ``,
          value: `field.value:(編集済み)<t:${timestamp}>`,
          inline: false,
        }],
        footer: {
          text: `footer:<t:${timestamp}>`,
          icon_url: "",
        },
        author: {
          name: `name:<t:${timestamp}>`,
          url: "",
          icon_url: "",
        },
      },
      {
        fields:[{name:"", value:"value1"}, {name:"", value:"value2"}],
      }],
    },
  });

//  if (!interaction.data.options) {
//    const payload = {
//      content: ':beer:\n```ts\nconsole.log("hello");\n````test`__test__',
//    };
//
//    let str_payload = JSON.stringify(payload).replaceAll("`", "\\u0060");
//    console.log(`    str_payload\n---------------------`);
//    console.log(`[${str_payload}]`);
//    console.log(`-----------------------------------------------`);
//
//    const str_msg = JSON.stringify("`` `" + str_payload + "` ``");
//
//    return `{"type": 4, "data": {"embeds": [{"description": ${str_msg}}] }}`;
//  }
//
//  const s = interaction.data.options[0].value;
//  console.log(`    loptions[0].value\n---------------------`);
//  console.log(`[${s.slice(1, -1)}]`);
//  console.log(`-----------------------------------------------`);
//  const data = s.slice(1, -1);
//  return `{"type": 4, "data": ${data}}`;
}
