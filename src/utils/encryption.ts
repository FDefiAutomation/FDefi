//const key = btoa("12jfd8sj1pdhf923k");

import CryptoJS from "crypto-js";

const ENC = CryptoJS.enc.Hex.parse("bf3c199c2470cb477d907b1e0917c17b");
const IV = CryptoJS.enc.Hex.parse("5183666c72eec9e4");
const ALGO = { iv: IV, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 };

export const encryptAES = (text: string): string => {
  const encrypted = CryptoJS.AES.encrypt(text, ENC, ALGO);
  return encrypted.toString();
};

export const decryptAES = (cipherText: string): string => {
  try {
    const decrypted = CryptoJS.AES.decrypt(cipherText, ENC, ALGO);
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Error decrypting:", error);
    return ""; // Or handle the error in a way appropriate for your application
  }
};

// Compute SHA-256 hash of a string
export const sha256 = (text: string): string => {
  return CryptoJS.SHA256(text).toString(CryptoJS.enc.Hex);
};
