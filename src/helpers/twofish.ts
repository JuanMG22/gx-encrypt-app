// @ts-expect-error declare module twofish
import { twofish as createTwofish } from "twofish";
const twofish = createTwofish();

// ==================== Helpers ====================

function padToBlockSize(text: string): Uint8Array {
  const blockSize = 16;
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);
  const paddingNeeded = blockSize - (bytes.length % blockSize);
  const paddedBytes = new Uint8Array(bytes.length + paddingNeeded);
  paddedBytes.set(bytes);
  for (let i = bytes.length; i < paddedBytes.length; i++) {
    paddedBytes[i] = 32; // espacio (0x20), igual a GX
  }
  return paddedBytes;
}

function unpadText(buffer: Uint8Array): string {
  const decoder = new TextDecoder("utf-8");
  return decoder.decode(buffer).trimEnd();
}

function hexToBytes(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) throw new Error("Clave inválida");
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

function uint8ToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToUint8(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// ==================== Twofish Wrapper ====================

export function encrypt64(text: string, hexKey: string): string {
  const key = hexToBytes(hexKey);
  const input = padToBlockSize(text);

  const encrypted = new Uint8Array(input.length);
  for (let i = 0; i < input.length; i += 16) {
    const block = input.subarray(i, i + 16);
    const encryptedBlock = twofish.encrypt(key, block);
    encrypted.set(encryptedBlock, i);
  }

  return uint8ToBase64(encrypted);
}

export function decrypt64(base64Text: string, hexKey: string): string {
  const key = hexToBytes(hexKey);
  const input = base64ToUint8(base64Text);

  const decrypted = new Uint8Array(input.length);
  for (let i = 0; i < input.length; i += 16) {
    const block = input.subarray(i, i + 16);
    const decryptedBlock = twofish.decrypt(key, block);
    decrypted.set(decryptedBlock, i);
  }

  return unpadText(decrypted);
}
