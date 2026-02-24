import { privateApi } from "./privateApi";

type LogoutResponse = {
  success: boolean;
  message: string;
};
export const logoutUser = (useToken: boolean = true) => {
  if (useToken) {
    return privateApi<LogoutResponse>("/logout", {
      method: "POST",
    });
  }
};