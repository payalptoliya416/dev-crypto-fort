const BASE_URL = import.meta.env.VITE_BASE_URL;

type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
};

export class AdminApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export async function adminPublicApi<T>(
  url: string,
  options: ApiOptions = {}
): Promise<T> {

  const res = await fetch(`${BASE_URL}${url}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
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

    let message = "Something went wrong";

    if (data?.errors) {
      const firstError = Object.values(data.errors as Record<string, string[]>)[0];
      message = firstError?.[0] || message;
    } 
    else if (data?.message) {
      message = data.message;
    }

    throw new AdminApiError(message, res.status, data);
  }

  return data as T;
}