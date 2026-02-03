import { publicApi } from "./publicApi";

type LoginPayload = {
  password: string;
};

type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    token: string;
    token_type: string;
    expires_in: number;
    user_id: number;
  };
};

export const loginUser = (body: LoginPayload) => {
  return publicApi<LoginResponse>("/login", {
    method: "POST",
    body,
  });
};
