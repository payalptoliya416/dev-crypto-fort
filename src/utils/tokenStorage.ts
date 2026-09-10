import CryptoJS from "crypto-js";

const TOKEN_KEY = "token";
const TOKEN_PREFIX = "enc:";
const TOKEN_STORAGE_KEY =
  import.meta.env.VITE_TOKEN_STORAGE_KEY || "crypto-fort-token-storage";

export const getStoredToken = (): string | null => {
  const storedToken = localStorage.getItem(TOKEN_KEY);
  if (!storedToken) return null;

  if (!storedToken.startsWith(TOKEN_PREFIX)) {
    setStoredToken(storedToken);
    return storedToken;
  }

  try {
    const decrypted = CryptoJS.AES.decrypt(
      storedToken.slice(TOKEN_PREFIX.length),
      TOKEN_STORAGE_KEY,
    ).toString(CryptoJS.enc.Utf8);

    return decrypted || null;
  } catch {
    return null;
  }
};

export const setStoredToken = (token: string) => {
  const encrypted = CryptoJS.AES.encrypt(token, TOKEN_STORAGE_KEY).toString();
  localStorage.setItem(TOKEN_KEY, `${TOKEN_PREFIX}${encrypted}`);
};

export const removeStoredToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};
