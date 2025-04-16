import React from "react";
import Contact from "@/components/ContactPage";
import RecaptchaProvider from "@/components/RecaptchaProvider";
function Page() {
  return (
    <RecaptchaProvider >
      <Contact />
    </RecaptchaProvider>
  );
}

export default Page;
