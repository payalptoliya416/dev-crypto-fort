const BASE_URL = import.meta.env.VITE_BASE_URL;

type ApiOptions = {
  method?: "GET" | "POST";
  body?: any;
};

export async function privateApi<T>(
  url: string,
  options: ApiOptions = {}
): Promise<T> {
  const token = localStorage.getItem("token");

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
    if (res.status === 401 || res.status === 419) {
      localStorage.removeItem("token");
      localStorage.removeItem("token_expiry");
      localStorage.removeItem("user_id");
      window.location.href = "/user/login";
    }

    throw data;
  }

  return data as T;
}
