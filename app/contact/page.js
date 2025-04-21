import React from "react";
import Contact from "@/components/ContactPage";
import RecaptchaProvider from "@/components/RecaptchaProvider";
import getMetadata from '@/lib/getMetadata';
import SEO_DATA from '@/lib/seo-data';

export const metadata = getMetadata(SEO_DATA.contact);

function Page() {
  return (
    <RecaptchaProvider >
      <Contact />
    </RecaptchaProvider>
  );
}

export default Page;
