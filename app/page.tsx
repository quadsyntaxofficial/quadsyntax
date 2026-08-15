import ComingSoon from "../components/coming-soon/ComingSoon";
import About from "../components/landing/About";
import HeroReveal from "../components/landing/Hero";
import TechSuit from "../components/landing/TechSuit";
import Creators from "../components/landing/Creators";
import Contact from "../components/landing/Contact";

export default function Home() {
  return (
    <>
      {/* <ComingSoon /> */}
      <HeroReveal />
      <About />
      <TechSuit/>
      <Creators />
      <Contact />
    </>
  );
}
