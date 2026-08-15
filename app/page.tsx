import ComingSoon from "../components/coming-soon/ComingSoon";
import Services from "../components/landing/Services";
import HeroReveal from "../components/landing/Hero";
import TechSuit from "../components/landing/TechSuit";
import Creators from "../components/landing/Creators";
import Contact from "../components/landing/Contact";

export default function Home() {
  return (
    <>
      {/* <ComingSoon /> */}
      <HeroReveal />
      <Services />
      <TechSuit/>
      <Creators />
      <Contact />
    </>
  );
}
