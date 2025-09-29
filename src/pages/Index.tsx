import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Gamification from "@/components/Gamification";
import EcoImpact from "@/components/EcoImpact";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      navigate("/dashboard");
    }
  };

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
