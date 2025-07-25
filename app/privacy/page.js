import Link from "next/link";
import { Button } from "@/components/ui/button";
import Container from "@/components/container";
import getMetadata from '@/lib/getMetadata';
import SEO_DATA from '@/lib/seo-data';

export const metadata = getMetadata({ ...SEO_DATA.privacy });


export default function Privacy() {
  // Last updated date for the Privacy Policy
  const lastUpdated = "April 8, 2025";

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="#FFDD00"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white dark:text-foreground mb-6">
            Privacy <span className="text-primary">Policy</span>
          </h1>
          <p className="text-xl text-white/80 dark:text-foreground/80 mb-8 max-w-3xl mx-auto">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16 bg-background">
        <Container>
          <div className="max-w-4xl mx-auto bg-card rounded-md p-8 md:p-12 shadow-md">
            <div className="prose max-w-none">
              <p className="lead text-lg mb-8">
                This Privacy Policy describes how The SEO Hustler (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, and discloses your personal information when you visit our website, use our tools, or engage with our services (collectively, the &quot;Services&quot;). Please read this Privacy Policy carefully to understand our practices regarding your personal information.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4">1. Information We Collect</h2>
              <p>We collect several types of information from and about users of our Services, including:</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">1.1 Personal Information</h3>
              <p>Contact Information: When you register for an account, subscribe to our newsletter, or request information, we collect personal information such as your name, email address, and phone number.</p>
              <p>Account Information: If you create an account, we collect your username, password, and preferences.</p>
              <p>Billing Information: For premium services, we collect payment information, billing address, and transaction history.</p>
              <p>Communication Information: When you contact us, we collect information you provide in your communications with us.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">1.2 Automatically Collected Information</h3>
              <p>Device Information: We collect information about your device, including your IP address, browser type, operating system, and device identifiers.</p>
              <p>Usage Information: We collect information about how you use our Services, including pages visited, time spent on pages, links clicked, and search queries.</p>
              <p>Location Information: We may collect approximate location information based on your IP address.</p>
              <p>Cookies and Similar Technologies: We use cookies, web beacons, and similar technologies to collect information about your browsing activities and to remember your preferences.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">1.3 Information from Third Parties</h3>
              <p>We may receive information about you from third parties, including:</p>
              <ul className="list-disc pl-6 my-4 space-y-2">
                <li>Business partners</li>
                <li>Social media platforms if you connect your account</li>
                <li>Analytics providers</li>
                <li>Advertising networks</li>
                <li>Search information providers</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">1.4 Google Account Integration</h3>
              <p>When you use a Google account to log in to our tools, website, or premium content, we may collect:</p>
              <ul className="list-disc pl-6 my-4 space-y-2">
                <li>Google Search Console data related to your websites</li>
                <li>Google Analytics data related to your websites</li>
                <li>Profile information from your Google account necessary for authentication</li>
              </ul>
              <p>This data allows us to provide personalized analysis and recommendations for your specific websites and marketing campaigns.</p>

              <h2 className="text-2xl font-bold mt-10 mb-4">2. How We Use Your Information</h2>
              <p>We use the information we collect for various purposes, including:</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">2.1 To Provide Our Services and Internal Research</h3>
              <p>In addition to providing our core Services, we may use collected data, including anonymized Google Search Console and Google Analytics data, for internal research purposes. This research helps us:</p>
              <ul className="list-disc pl-6 my-4 space-y-2">
                <li>Improve our tools and services</li>
                <li>Identify industry trends and benchmarks</li>
                <li>Develop new features based on aggregated user needs</li>
                <li>Create better educational content for our users</li>
              </ul>
              <p>All data used for research is anonymized to protect your privacy and individual website data.</p>
              <p>To create and maintain your account</p>
              <p>To provide, operate, and maintain our Services</p>
              <p>To process and complete transactions</p>
              <p>To send administrative information, like technical notices, security alerts, and support messages</p>
              <p>To respond to your comments and questions</p>
              <p>To provide customer support</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">2.2 To Improve Our Services</h3>
              <p>To understand how users access and use our Services</p>
              <p>To evaluate and improve our Services, including developing new products and features</p>
              <p>To conduct research and analysis</p>
              <p>To monitor and analyze usage and activity trends</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">2.3 For Marketing Purposes</h3>
              <p>To send promotional communications about new features, offers, products, and Services</p>
              <p>To deliver relevant website content and advertisements</p>
              <p>To measure or understand the effectiveness of advertisements</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">2.4 For Security and Compliance</h3>
              <p>To detect, prevent, and address technical issues, fraud, or illegal activity</p>
              <p>To comply with legal obligations</p>
              <p>To enforce our Terms of Service</p>

              <h2 className="text-2xl font-bold mt-10 mb-4">3. How We Share Your Information</h2>
              <p>We may share your personal information in the following situations:</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">3.1 With Service Providers</h3>
              <p>We share information with third-party vendors, consultants, and other service providers who perform services on our behalf, such as payment processing, data analysis, email delivery, hosting, customer service, and marketing assistance.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">3.2 Treatment of Google Analytics and Search Console Data</h3>
              <p>For Google Search Console data, Google Analytics data, and other information collected when you connect your Google account to our Services:</p>
              <ul className="list-disc pl-6 my-4 space-y-2">
                <li>We anonymize portions of this information in our database to protect your privacy</li>
                <li>We use this data for our internal research to improve our tools and services</li>
                <li>We do not sell or share this data with third parties without your explicit consent</li>
                <li>Any aggregated analysis derived from this data is completely anonymized before being included in research or case studies</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">3.3 With Business Partners</h3>
              <p>We may share information with our business partners to offer joint promotions or products. This does not include sharing your Google Search Console or Google Analytics data.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">3.4 For Legal Reasons</h3>
              <p>We may disclose information:</p>
              <ul className="list-disc pl-6 my-4 space-y-2">
                <li>To comply with applicable laws and regulations</li>
                <li>To respond to a subpoena, search warrant, or other lawful request for information</li>
                <li>To protect our rights, property, or safety, and that of our users or others</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">3.5 During Business Transfers</h3>
              <p>If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction. In such an event, we will notify you before your personal information becomes subject to a different privacy policy.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">3.6 With Your Consent</h3>
              <p>We may disclose your personal information for any other purpose with your consent. Specifically regarding Google Search Console and Google Analytics data, we will always obtain your explicit consent before sharing any non-anonymized data with third parties.</p>

              <h2 className="text-2xl font-bold mt-10 mb-4">4. Your Privacy Choices</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">4.1 Account Information</h3>
              <p>You can review and update your account information by logging into your account settings.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">4.2 Communication Preferences</h3>
              <p>You can opt out of receiving promotional emails by following the unsubscribe instructions in these emails. Even if you opt out, we may still send you non-promotional communications, such as those about your account or our ongoing business relations.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">4.3 Cookies and Tracking Technologies</h3>
              <p>Most web browsers are set to accept cookies by default. You can usually choose to set your browser to remove or reject cookies. Please note that removing or rejecting cookies could affect the availability and functionality of our Services.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">4.4 Do Not Track</h3>
              <p>We do not currently respond to &quot;Do Not Track&quot; signals or other mechanisms that provide consumer choice regarding the collection of information about your online activities over time and across third-party websites.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">4.5 Google Account Data</h3>
              <p>If you have connected your Google account to our Services, you can:</p>
              <ul className="list-disc pl-6 my-4 space-y-2">
                <li>Revoke our access to your Google Search Console and Google Analytics data at any time through your Google account settings</li>
                <li>Request that we delete all stored data collected through your Google account connection by contacting us at <a href="mailto:privacy@theseohustler.com">privacy@theseohustler.com</a></li>
                <li>Request information about how your Google data has been used by our Services</li>
              </ul>

              <h2 className="text-2xl font-bold mt-10 mb-4">5. Data Security</h2>
              <p>We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. However, the transmission of information via the internet is not completely secure. Although we do our best to protect your personal information, we cannot guarantee the security of your personal information transmitted to our Services.</p>

              <h2 className="text-2xl font-bold mt-10 mb-4">6. Third-Party Links and Services</h2>
              <p>Our Services may contain links to third-party websites, tools, or services that are not owned or controlled by us. This Privacy Policy only applies to our Services. We have no control over and assume no responsibility for the privacy policies or practices of any third-party sites or services.</p>

              <h2 className="text-2xl font-bold mt-10 mb-4">7. Children&apos;s Privacy</h2>
              <p>Our Services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe we have collected information from your child under 13, please contact us, and we will delete such information.</p>

              <h2 className="text-2xl font-bold mt-10 mb-4">8. International Data Transfers</h2>
              <p>We are based in Brazil and process data in Brazil, the United States and other countries. If you are accessing our Services from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States and other countries where our servers are located.</p>

              <h2 className="text-2xl font-bold mt-10 mb-4">9. California Privacy Rights</h2>
              <p>If you are a California resident, you have specific rights regarding your personal information under the California Consumer Privacy Act (CCPA). These include:</p>
              <ul className="list-disc pl-6 my-4 space-y-2">
                <li>The right to know what personal information we collect about you</li>
                <li>The right to request deletion of your personal information</li>
                <li>The right to opt out of the sale of your personal information</li>
                <li>The right to non-discrimination for exercising your CCPA rights</li>
              </ul>
              <p>To exercise these rights, please contact us using the information provided in the &quot;Contact Us&quot; section.</p>

              <h2 className="text-2xl font-bold mt-10 mb-4">10. Changes to Our Privacy Policy</h2>
              <p>We may update our Privacy Policy from time to time. If we make material changes, we will notify you by email or by posting a notice on our website prior to the change becoming effective. We encourage you to review our Privacy Policy periodically for the latest information on our privacy practices.</p>

              <h2 className="text-2xl font-bold mt-10 mb-4">11. Contact Us</h2>
              <p>If you have any questions or concerns about this Privacy Policy or our privacy practices, please contact us at:</p>
              <address className="not-italic mt-4">
                <strong>The SEO Hustler</strong>
                <br />
                Avenida Paulista 11-6 - Sala 01, 16º Andar
                <br />
                São Paulo/SP
                <br />
                01310-914
                <br />
                Brazil
                <br />
                Email: <a href="mailto:privacy@theseohustler.com">privacy@theseohustler.com</a>
              </address>
            </div>

            <div className="mt-12 border-t border-outline/20 pt-8 text-center">
              <p className="mb-6">
                By using our website and services, you consent to this Privacy
                Policy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/terms">
                  <Button
                    size="lg"
                  >
                    Terms of Service
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    variant="secondary"
                    size="lg"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
