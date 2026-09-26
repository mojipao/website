import Nav from "@/components/Nav";
import Starfield from "@/components/Starfield";
import About from "@/components/sections/About";
import Background from "@/components/sections/Background";
import Contact from "@/components/sections/Contact";
import Experience from "@/components/sections/Experience";
import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";

export default function Home() {
  return (
    <>
      <Starfield />
      <Nav />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Background />
        <Contact />
      </main>
    </>
  );
}
