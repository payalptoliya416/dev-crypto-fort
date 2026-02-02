import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

type AppLogoProps = {
  to?: string;
  className?: string;
  imgClassName?: string;
};

function AppLogo({
  to = "/",
  className = "",
  imgClassName = "h-6 sm:h-auto",
}: AppLogoProps) {
  return (
    <Link
      to={to}
      className={`absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 z-10 ${className}`}
    >
      <img
        src={logo}
        alt="Secure Wallet"
        className={imgClassName}
      />
    </Link>
  );
}

export default AppLogo;
