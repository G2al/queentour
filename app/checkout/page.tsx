import type { Metadata } from "next";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import CartPage from "@/app/components/booking/CartPage";
export const metadata: Metadata = { title: "Completa la richiesta | Queen Tour", robots: { index: false, follow: false } };
export default function Page() { return <><Header /><CartPage startCheckout /><Footer /></>; }
