import type { Metadata } from "next";
import CartPage from "@/app/components/booking/CartPage";
export const metadata: Metadata = { title: "Il tuo carrello | Queen Tour", robots: { index: false, follow: false } };
export default function Page() { return <CartPage />; }
