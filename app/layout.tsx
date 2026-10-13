import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Queen Tour | Specialisti Egitto e Hurghada",
  description:
    "Queen Tour è specializzata in servizi Solo Land in Egitto: hotel, trasferimenti ed escursioni a Hurghada e sul Mar Rosso.",
  icons: {
    icon: {
      url: "/images/favicon-queentour.png",
      type: "image/png",
    },
    shortcut: "/images/favicon-queentour.png",
    apple: "/images/favicon-queentour.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="it"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
