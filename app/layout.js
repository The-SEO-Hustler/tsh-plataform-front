import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { FirebaseProvider } from "@/lib/firebase-context";
import { Toaster } from "@/components/ui/sonner";
import AnalysisStatusCard from "@/components/AnalysisStatusCard";
import EditOnGitHub from "@/components/editOnGithub";
import { UsageProvider } from "@/lib/usage-context";
import { ThemeProviderWrapper } from "@/components/ThemeProvider";
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="rBdYZW92wmxvaGrL9URAvg"
          async
        ></script>
      </head>
      <body className={`${inter.className} antialiased `}>
        <ThemeProviderWrapper>
          <AppRouterCacheProvider>
            <Analytics />
            <FirebaseProvider>
              <UsageProvider>
                {/* <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}> */}
                <Header />
                {children}
                <Footer />
                <EditOnGitHub />
                <AnalysisStatusCard />

                <Toaster
                  position="top-left"
                  toastOptions={{
                    style: { color: "rgb(var(--foreground))" },
                  }}
                />
                {/* </GoogleReCaptchaProvider> */}
              </UsageProvider>
            </FirebaseProvider>
          </AppRouterCacheProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
