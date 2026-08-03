import CryptoJS from "crypto-js";

const COOKIE_NAME = "encrypted_seed_phrase";

export const setCookie = (name: string, value: string, days = 365) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/; SameSite=Strict; Secure";
};

export const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
};

export const eraseCookie = (name: string) => {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};

export const saveEncryptedSeedPhrase = (seedPhrase: string, pin: string) => {
  try {
    const encrypted = CryptoJS.AES.encrypt(seedPhrase.trim(), pin).toString();
    setCookie(COOKIE_NAME, encrypted, 365);
    localStorage.setItem(COOKIE_NAME, encrypted); // backup storage
  } catch (error) {
    console.error("Failed to encrypt and save seed phrase", error);
  }
};

export const getEncryptedSeedPhrase = (): string | null => {
  const fromCookie = getCookie(COOKIE_NAME);
  if (fromCookie) return fromCookie;

  const fromStorage = localStorage.getItem(COOKIE_NAME);
  if (fromStorage) {
    setCookie(COOKIE_NAME, fromStorage, 365);
    return fromStorage;
  }
  return null;
};

export const decryptSeedPhrase = (pin: string): string | null => {
  const encrypted = getEncryptedSeedPhrase();
  if (!encrypted) return null;
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, pin);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted || decrypted.trim() === "") return null;
    return decrypted;
  } catch (error) {
    return null;
  }
};

export const clearEncryptedSeedPhrase = () => {
  eraseCookie(COOKIE_NAME);
  localStorage.removeItem(COOKIE_NAME);
};

export const hasEncryptedSeedPhrase = (): boolean => {
  return !!getEncryptedSeedPhrase();
};
