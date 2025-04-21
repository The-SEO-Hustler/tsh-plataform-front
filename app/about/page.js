import React from "react";
import About from "@/components/AboutPage";
import getMetadata from '@/lib/getMetadata';
import SEO_DATA from '@/lib/seo-data';
// export const metadata = {
//   title: "About Us",
//   description: "About Us",
//   openGraph: {
//     title: "About Us",
//     description: "About Us",

//   },
// };

export const metadata = getMetadata(SEO_DATA.about);

function Page() {
  return <About />;
}

export default Page;
