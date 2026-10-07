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
  title: "Queen Tour | Tour Operator ad Aversa",
  description:
    "Queen Tour, tour operator ad Aversa in provincia di Caserta. Scopri i nostri pacchetti viaggio e parti con noi.",
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
