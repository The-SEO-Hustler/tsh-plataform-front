import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { FirebaseProvider } from "@/lib/firebase-context";
import { Toaster } from "sonner";
import AnalysisStatusCard from "@/components/AnalysisStatusCard";
import ContentPlanningStatusCard from "@/components/ContentPlanningStatusCard";
import KeywordAnalysisStatusCard from "@/components/KeywordAnalysisStatusCard";
import LLMStatusCard from "@/components/LLMStatusCard";
import { UsageProvider } from "@/lib/usage-context";
// import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { Analytics } from "@vercel/analytics/react";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "The SEO Hustler",
  description:
    "The SEO Hustler provides free SEO tools, in-depth guides, and resources to help you learn and execute SEO by yourself.",
  openGraph: {
    title: "The SEO Hustler",
    description:
      "The SEO Hustler provides free SEO tools, in-depth guides, and resources to help you learn and execute SEO by yourself.",
  },
  robots: { index: "index", follow: "follow" },

};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://analytics.ahrefs.com/analytics.js" data-key="rBdYZW92wmxvaGrL9URAvg" async></script>
      </head>
      <body className={`${inter.className} antialiased`}>
        <AppRouterCacheProvider>
          <Analytics />
          <FirebaseProvider>
            <UsageProvider>

              {/* <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}> */}

              <Header />
              {children}
              <Footer />
              <KeywordAnalysisStatusCard />
              <AnalysisStatusCard />
              <ContentPlanningStatusCard />
              <LLMStatusCard />
              <Toaster position="top-left" />
              {/* </GoogleReCaptchaProvider> */}
            </UsageProvider>
          </FirebaseProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
