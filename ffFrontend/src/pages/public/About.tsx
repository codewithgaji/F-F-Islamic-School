import { PageHeader } from "@/components/PageHeader";
import { AboutSection } from "@/components/sections/AboutSection";
import { FacilitiesSection } from "@/components/sections/FacilitiesSection";
import { TeachersSection } from "@/components/sections/TeachersSection";

const About = () => (
  <>
    <PageHeader title="About Us" crumbs={[{ label: "Home", to: "/" }, { label: "About Us" }]} />
    <AboutSection endpoint="/about" showCta={false} />
    <FacilitiesSection />
    <TeachersSection limit={4} />
  </>
);

export default About;