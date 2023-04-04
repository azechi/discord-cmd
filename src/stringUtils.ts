export function hexToBytes(s: string) {
  return new Uint8Array((s.match(/../g) ?? []).map((x) => parseInt(x, 16)));
}
