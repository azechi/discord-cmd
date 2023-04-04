if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  const { generateHMACRawKey } = await import("./testingUtil");

  const rawKey = await generateHMACRawKey();
  test("hmac", async () => {
    const { digest, verify } = await hmac(rawKey);

    const blob = new Uint8Array(256);
    crypto.getRandomValues(blob);

    const hash = await digest(blob);

    expect(await verify(hash, blob)).toBe(true);
    crypto.getRandomValues(blob);
    expect(await verify(hash, blob)).not.toBe(true);
  });
}

export async function hmac(rawKey: ArrayBufferLike) {
  const key = await crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "HMAC", hash: { name: "SHA-256" } },
    false,
    ["sign", "verify"]
  );

  const digest = (message: ArrayBufferLike) => {
    return crypto.subtle.sign("HMAC", key, message);
  };

  // safe-compare ?
  const verify = (digest: ArrayBufferLike, message: ArrayBufferLike) => {
    return crypto.subtle.verify("HMAC", key, digest, message);
  };

  return { digest, verify } as const;
}
