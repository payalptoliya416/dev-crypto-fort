import { AdminApiError } from "./adminPublicApi";

const BASE_URL = import.meta.env.VITE_BASE_URL;

type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
};

const ADMIN_TOKEN_KEY = "admin_token";
const ADMIN_TOKEN_EXPIRY_KEY = "admin_token_expiry";
const ADMIN_NAME_KEY = "admin_name";

const clearAdminSession = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_TOKEN_EXPIRY_KEY);
  localStorage.removeItem(ADMIN_NAME_KEY);
};

const isAdminTokenExpired = () => {
  const expiry = localStorage.getItem(ADMIN_TOKEN_EXPIRY_KEY);
  if (!expiry) return true;
  const expiryTime = Number(expiry);
  if (Number.isNaN(expiryTime)) return true;
  return Date.now() >= expiryTime;
};

export async function adminPrivateApi<T>(
  url: string,
  options: ApiOptions = {}
): Promise<T> {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);

  if (!token || isAdminTokenExpired()) {
    clearAdminSession();
    window.location.href = "/admin";
    throw new AdminApiError("Admin session expired", 401, { message: "Admin session expired" });
  }

  const res = await fetch(`${BASE_URL}${url}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let data: any;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    let message = data?.message || "Something went wrong";

    if (data?.errors) {
      const firstError = Object.values(data.errors as Record<string, string[]>)[0];
      message = firstError?.[0] || message;
    }

    if (res.status === 401 || res.status === 419 || message.toLowerCase().includes("expired")) {
      clearAdminSession();
      window.location.href = "/admin";
    }

    throw new AdminApiError(message, res.status, data);
  }

  return data as T;
}