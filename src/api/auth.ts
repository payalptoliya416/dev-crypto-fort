const TOKEN_KEY = "token";
const EXPIRY_KEY = "token_expiry";

export const saveToken = (token: string) => {
  const expiryTime = Date.now() + 24 * 60 * 60 * 1000; 

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EXPIRY_KEY, expiryTime.toString());
};

export const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(EXPIRY_KEY);

  if (!token || !expiry) return null;

  if (Date.now() > Number(expiry)) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRY_KEY);
    return null;
  }

  return token;
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRY_KEY);
};