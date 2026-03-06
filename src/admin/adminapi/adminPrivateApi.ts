const BASE_URL = import.meta.env.VITE_BASE_URL;

type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
};

export async function adminPrivateApi<T>(
  url: string,
  options: ApiOptions = {}
): Promise<T> {

  const token = localStorage.getItem("admin_token");

  const res = await fetch(`${BASE_URL}${url}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw data;
  }

  return data as T;
}