import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import Header from "../components/layout/Header";
import SmoothScroll from "../providers/SmoothScroll";
import Footer from "../components/layout/Footer";
import GlobalLoader from "@/components/coming-soon/GlobalLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

const azonix = localFont({
  src: "../public/fonts/Azonix.otf",
  variable: "--font-azonix-local",
  display: "swap",
});

const nasalization = localFont({
  src: "../public/fonts/Nasalization.otf",
  variable: "--font-nasalization-local",
  display: "swap",
});

export const metadata: Metadata = {
  title: "QuadSyntax — Welcome to the future of software.",
  description:
    "QuadSyntax is a new generation of software development. We're building a new future for software development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${azonix.variable} ${nasalization.variable} h-full antialiased`}
    >
      <body className="min-h-screen overflow-x-hidden">
        {/* Runs before hydration — stops the browser from restoring a stale
            scroll position ahead of Lenis/ScrollTrigger's own measurements,
            which is what causes the layout to visibly jump on reload. */}
        <Script id="disable-scroll-restoration" strategy="beforeInteractive">
          {`if ("scrollRestoration" in window.history) { window.history.scrollRestoration = "manual"; } window.scrollTo(0, 0);`}
        </Script>
        <GlobalLoader />
        <SmoothScroll duration={2.4} wheelMultiplier={0.6} anchorOffset={80}>
          <Header />
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
