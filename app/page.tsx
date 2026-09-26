import SceneLoader from "@/components/canvas/SceneLoader";
import Nav from "@/components/ui/Nav";
import DepthGauge from "@/components/ui/DepthGauge";
import Hero from "@/components/sections/Hero";
import Bio from "@/components/sections/Bio";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Education from "@/components/sections/Education";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <SceneLoader />
      <Nav />
      <DepthGauge />
      <main className="relative">
        <Hero />
        <Bio />
        <Experience />
        <Projects />
        <Education />
        <Contact />
      </main>
    </>
  );
}
