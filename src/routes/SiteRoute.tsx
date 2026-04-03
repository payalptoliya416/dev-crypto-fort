import SiteFooter from "../site/common/SiteFooter";
import AvailabilitySection from "../site/pages/home/AvailabilitySection";
import BuiltOpenSection from "../site/pages/home/BuiltOpenSection";
import DefenseSection from "../site/pages/home/DefenseSection";
import FeaturesGridSection from "../site/pages/home/FeaturesGridSection";
import FeaturesSection from "../site/pages/home/FeaturesSection";
import GetStarted from "../site/pages/home/GetStarted";
import Home from "../site/pages/home/HeroSection";
import SecurityVerifySection from "../site/pages/home/SecurityVerifySection";
import WhyChooseSection from "../site/pages/home/WhyChooseSection";

export default function SiteRoute() {
  return (
    <main className="bg-white">
      <Home />
      <FeaturesSection/>
      <DefenseSection/>
      <FeaturesGridSection/>
      <SecurityVerifySection/>
      <GetStarted/>
      <WhyChooseSection/>
      <AvailabilitySection/>
      <BuiltOpenSection/>
      <SiteFooter/>
    </main>
  );
}
