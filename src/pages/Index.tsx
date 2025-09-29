import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Gamification from "@/components/Gamification";
import EcoImpact from "@/components/EcoImpact";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <Gamification />
      <EcoImpact />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
