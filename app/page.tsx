import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { HomeSection } from "@/components/sections/HomeSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { FavoritesSection } from "@/components/sections/FavoritesSection";

export default function Home() {
  return (
    <>
      <Navbar />

      <section id="home">
        <HomeSection />
      </section>

      <section id="skills">
        <SkillsSection />
      </section>

      <section id="projects">
        <ProjectsSection />
      </section>

      <section id="favorites">
        <FavoritesSection />
      </section>

      <Footer />
    </>
  );
}
