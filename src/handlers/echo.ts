export default async function echoHandler(interaction: any) {

  return JSON.stringify({
    type: 4,
    data: {
      //content: "<@380159513791168512>さんのメッセージhttps://discord.com/channels/380159850577133571/380159851013210133/1095914351006863460です",
      embeds: [{
        color: `${parseInt("4e5058", 16)}`,
        thumbnail: {
          url: "https://cdn.discordapp.com/avatars/380159513791168512/93a42ea08fe4efcd9e69f8342c09a24d.png"},
        description:`<@380159513791168512>\n\n` + `ここが引用する本文ですよ。そして\n改行\n\nもはいってます。:beer:\n<:mebae:757027794608980076>`,
        //footer: {
        //  text: `(編集済)`,
        //},
        timestamp: "2023-03-25T02:47:23.958000+00:00",
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
