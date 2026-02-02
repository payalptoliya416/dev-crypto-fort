import { publicApi } from "./publicApi";

type LoginPayload = {
  password: string;
};

type LoginResponse = {
  success: boolean;
  message: string;
  data?: {
    user_id: number;
    wallet_id: number;
  };
};

export const loginUser = (body: LoginPayload) => {
  return publicApi<LoginResponse>("/login", {
    method: "POST",
    body,
  });
};
