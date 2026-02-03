import { useState } from "react";
import { createWallet } from "../api/createWallet";

export const useCreateWallet = (useToken: boolean) => {
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    try {
      setLoading(true);

      const res = await createWallet(useToken);

      return res.data;
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleCreate };
};
