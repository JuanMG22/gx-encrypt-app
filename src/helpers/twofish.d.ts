/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "twofish" {
  const twofish: (iv?: number[] | Uint8Array) => {
    encrypt: (key: Uint8Array, data: Uint8Array) => Uint8Array;
    decrypt: (key: Uint8Array, data: Uint8Array) => Uint8Array;
    encryptCBC: (key: Uint8Array, data: Uint8Array) => Uint8Array;
    decryptCBC: (key: Uint8Array, data: Uint8Array) => Uint8Array;
    stringToByteArray: (str: string) => number[];
    byteArrayToString: (bytes: Uint8Array | number[]) => string;
    equalsArray: (a: any[], b: any[]) => boolean;
  };

  export { twofish };
}
