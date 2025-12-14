const encoder = new TextEncoder();
const decoder = new TextDecoder();

const ITERATIONS = 250_000;
const SALT_KEY = "souls-eternal-salt";

async function getKeyMaterial(password: string) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
}

async function deriveKey(password: string) {
  const keyMaterial = await getKeyMaterial(password);

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode(SALT_KEY),
      iterations: ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptText(text: string, password: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password);

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(text)
  );

  return {
    iv: Array.from(iv),
    data: Array.from(new Uint8Array(encrypted)),
  };
}

export async function decryptText(
  encrypted: { iv: number[]; data: number[] },
  password: string
) {
  const key = await deriveKey(password);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(encrypted.iv) },
    key,
    new Uint8Array(encrypted.data)
  );

  return decoder.decode(decrypted);
}
