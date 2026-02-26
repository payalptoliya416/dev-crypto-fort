import { privateApi } from "./privateApi";

type LogoutResponse = {
  success: boolean;
  message: string;
};
export const logoutUser = async () => {
  try {
    return await privateApi<LogoutResponse>("/logout", {
      method: "POST",
    });
  } catch (error) {
    return null;
  }
};