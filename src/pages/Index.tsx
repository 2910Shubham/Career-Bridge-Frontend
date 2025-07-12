import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import JobFeed from "@/components/JobFeed";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <JobFeed />
      <AboutSection />
      <Footer />
    </div>
  );
};

export default Index;
