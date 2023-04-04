export default async function postHandler(_: any) {
  return { type: 4, data: { content: "postコマンドですね!" } };
}
