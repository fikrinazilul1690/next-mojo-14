import Utf8 from 'crypto-js/enc-utf8';
import AES from 'crypto-js/aes';

export const encrypt = (data: any): string =>
  AES.encrypt(
    JSON.stringify(data),
    process.env.ENCRYPTED_KEY as string
  ).toString();

export const decrypt = (token: string): string => {
  const bytes = AES.decrypt(token, process.env.ENCRYPTED_KEY as string);
  return bytes.toString(Utf8);
};
