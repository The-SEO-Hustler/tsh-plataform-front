import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { FirebaseProvider } from "@/lib/firebase-context";
import { Toaster } from "sonner";
import AnalysisStatusCard from "@/components/AnalysisStatusCard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "The SEO Hustler",
  description:
    "The SEO Hustler provides free SEO tools, in-depth guides, and resources to help you learn and execute SEO by yourself.",
  openGraph: {
    title: "The SEO Hustler",
    description:
      "The SEO Hustler provides free SEO tools, in-depth guides, and resources to help you learn and execute SEO by yourself.",
  },
  robots: { index: "no-index" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppRouterCacheProvider>
          <FirebaseProvider>
            <Header />
            {children}
            <Footer />
            <AnalysisStatusCard />
            <Toaster position="top-right" />
          </FirebaseProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
