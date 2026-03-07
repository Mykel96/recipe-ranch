import Navbar from "./components/navbar";
import Hero from "./components/hero";
import FeaturedRecipes from "./components/featured-recipes";
import HowItWorks from "./components/how-it-works";
import Testimonials from "./components/testimonials";
import CTASection from "./components/cta-section";
import Footer from "./components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <FeaturedRecipes />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
