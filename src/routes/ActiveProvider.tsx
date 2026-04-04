import { createContext, useContext, useState } from "react";

type ActiveContextType = {
  active: string;
  setActive: (val: string) => void;
};

const ActiveContext = createContext<ActiveContextType | null>(null);

export const ActiveProvider = ({ children }: any) => {
  const [active, setActive] = useState("Home");

  return (
    <ActiveContext.Provider value={{ active, setActive }}>
      {children}
    </ActiveContext.Provider>
  );
};

export const useActive = () => {
  const context = useContext(ActiveContext);
  if (!context) throw new Error("useActive must be used inside provider");
  return context;
};