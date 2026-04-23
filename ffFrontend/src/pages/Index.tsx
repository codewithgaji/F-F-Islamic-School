import { HeroSlider } from "@/components/sections/HeroSlider";
import { FacilitiesSection } from "@/components/sections/FacilitiesSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ClassesSection } from "@/components/sections/ClassesSection";
import { BookSeatSection } from "@/components/sections/BookSeatSection";
import { TeachersSection } from "@/components/sections/TeachersSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { BlogPreviewSection } from "@/components/sections/BlogPreviewSection";

const Index = () => (
  <>
    <HeroSlider />
    <FacilitiesSection />
    <AboutSection endpoint="/about-preview" />
    <ClassesSection featuredOnly limit={3} />
    <BookSeatSection />
    <TeachersSection limit={4} />
    <TestimonialsSection />
    <BlogPreviewSection />
  </>
);

export default Index;
