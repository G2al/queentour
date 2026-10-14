import Header from "./components/Header";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import JourneySteps from "./components/JourneySteps";
import PackagesCarousel from "./components/PackagesCarousel";
import PartnerBar from "./components/PartnerBar";
import ReviewsSection from "./components/ReviewsSection";
import WhyQueenTour from "./components/WhyQueenTour";
import { getServerPackages } from "@/lib/server-api";
import type { TravelPackage } from "./data/travelPackages";

export default async function Home() {
  let packages: TravelPackage[] = [];
  let packagesError = false;
  try {
    const response = await getServerPackages({ featured: 1, per_page: 6, sort: "recommended" });
    packages = response.data;
  } catch {
    packagesError = true;
  }
  return (
    <>
      <Header />
      <main>
        <Hero />
        <PartnerBar />
        <PackagesCarousel packages={packages} loadError={packagesError} />
        <JourneySteps />
        <WhyQueenTour />
        <ReviewsSection />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
