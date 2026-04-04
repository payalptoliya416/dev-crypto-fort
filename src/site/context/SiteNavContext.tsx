import { createContext, useContext, useEffect, useState } from "react";

const sectionIds = ["top", "security", "features", "howwork", "plateform", "openscouce"];

const sectionNameMap: Record<string, string> = {
  top: "Home",
  security: "Security",
  features: "Features",
  howwork: "How It Works",
  plateform: "Platforms",
  openscouce: "Open Source",
};

type SiteNavContextType = {
  active: string;
  setActive: (name: string) => void;
  scrollToSection: (id: string) => void;
};

const SiteNavContext = createContext<SiteNavContextType>({
  active: "Home",
  setActive: () => {},
  scrollToSection: () => {},
});

export function SiteNavProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState("Home");

  const scrollToSection = (id: string) => {
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  // Auto-detect active section on scroll
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY < 100) {
        setActive("Home");
        return;
      }
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        if (id === "top") continue;
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top;
          if (top <= 120) {
            setActive(sectionNameMap[id]);
            return;
          }
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <SiteNavContext.Provider value={{ active, setActive, scrollToSection }}>
      {children}
    </SiteNavContext.Provider>
  );
}

export const useSiteNav = () => useContext(SiteNavContext);
