import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import FloatingWhatsApp from "@/app/components/FloatingWhatsApp";

export default function AgencyLayout({ children }: { children: React.ReactNode }) {
  return <><Header />{children}<Footer /><FloatingWhatsApp /></>;
}
