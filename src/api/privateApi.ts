const BASE_URL = "http://192.168.29.134:8080/api";

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
    throw new Error(data?.message || "Something went wrong");
  }

  return data as T;
}
