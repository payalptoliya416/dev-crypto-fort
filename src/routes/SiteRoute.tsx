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
import { motion } from "framer-motion";

const sectionAnimation = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true },
};

export default function SiteRoute() {
  return (
    <main className="bg-white">
      
      {/* HERO */}
      <Home />

      {/* SECURITY */}
      <motion.div id="security" className="scroll-mt-24" {...sectionAnimation}>
        <FeaturesSection />
        <DefenseSection />
      </motion.div>

       {/* FEATURES */}
      <motion.div id="features" className="scroll-mt-24" {...sectionAnimation}>
        <FeaturesGridSection />
      </motion.div>
      
      {/* VERIFY */}
      <motion.div className="scroll-mt-24" {...sectionAnimation}>
        <SecurityVerifySection />
      </motion.div>

       {/* HOW IT WORKS */}
      <motion.div id="howwork" className="scroll-mt-24" {...sectionAnimation}>
        <GetStarted />
      </motion.div>

      {/* WHY */}
      <motion.div className="scroll-mt-24" {...sectionAnimation}>
        <WhyChooseSection />
      </motion.div>

      {/* PLATFORM */}
      <motion.div id="plateform" className="scroll-mt-24" {...sectionAnimation}>
        <AvailabilitySection />
      </motion.div>

        {/* OPEN SOURCE */}
      <motion.div id="openscouce" className="scroll-mt-24" {...sectionAnimation}>
        <BuiltOpenSection />
      </motion.div>

      {/* FOOTER */}
      <SiteFooter />
    </main>
  );
}
