import Header from "./components/Header";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import JourneySteps from "./components/JourneySteps";
import PackagesCarousel from "./components/PackagesCarousel";
import PartnerBar from "./components/PartnerBar";
import ReviewsSection from "./components/ReviewsSection";
import WhyQueenTour from "./components/WhyQueenTour";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <PartnerBar />
        <PackagesCarousel />
        <JourneySteps />
        <WhyQueenTour />
        <ReviewsSection />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
