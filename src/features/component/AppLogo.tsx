import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import logo2 from "@/assets/logo2.png";
import { useEffect, useState } from "react";

type AppLogoProps = {
  to?: string;
  className?: string;
  imgClassName?: string;
};

function AppLogo({
  className = "",
  imgClassName = "pe-1",
}: AppLogoProps) {
  const [isSmall, setIsSmall] = useState(window.innerWidth < 375);
  const token = localStorage.getItem("token");

useEffect(() => {
  const handleResize = () => {
    setIsSmall(window.innerWidth < 375);
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);
  return (
    <Link
        to={token ? "/dashboard" : "/"}
      className={`absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 z-10 ${className}`}
    >
      <img
          src={isSmall ? logo2 : logo}
        alt="Secure Wallet"
        className={imgClassName}
      />
    </Link>
  );
}

export default AppLogo;
