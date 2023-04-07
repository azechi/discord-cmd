export async function generateHMACRawKey() {
  const key = (await crypto.subtle.generateKey(
    { name: "HMAC", hash: { name: "SHA-256" } },
    true,
    ["sign", "verify"]
  )) as CryptoKey;

  return (await crypto.subtle.exportKey("raw", key)) as ArrayBuffer;
}
