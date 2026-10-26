import Header from "./components/Header";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import JourneySteps from "./components/JourneySteps";
import PartnerBar from "./components/PartnerBar";
import WhyQueenTour from "./components/WhyQueenTour";
import { getServerPackageFilters } from "@/lib/server-api";
import type { PackageFilters } from "./data/travelPackages";

export default async function Home() {
  let filterOptions: PackageFilters | null = null;
  try {
    filterOptions = await getServerPackageFilters();
  } catch {
    // La homepage resta visitabile anche se il catalogo non è raggiungibile.
  }
  return (
    <>
      <Header />
      <main>
        <Hero filterOptions={filterOptions} />
        <PartnerBar />
        <JourneySteps />
        <WhyQueenTour />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
