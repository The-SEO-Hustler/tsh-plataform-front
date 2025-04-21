import Link from "next/link";
import { Button } from "@/components/ui/button";
import Container from "@/components/container";
import getMetadata from '@/lib/getMetadata';
import SEO_DATA from '@/lib/seo-data';

export const metadata = getMetadata(SEO_DATA.terms);

export default function Terms() {
  // Last updated date for the Terms
  const lastUpdated = "April 8, 2025";

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#4e503a] to-black relative overflow-hidden">
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

        <Container className="text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
            Terms of <span className="text-primary">Service</span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            Last Updated: {lastUpdated}
          </p>
        </Container>
      </section>

      {/* Terms Content */}
      <section className="py-16 bg-background">
        <Container>
          <div className="max-w-4xl mx-auto bg-gray-200 rounded-md p-8 md:p-12 shadow-md">
            <div className="prose max-w-none">

              <p className="lead text-lg mb-8">
                Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the websites, tools, and services (collectively, the "Services") operated by The SEO Hustler ("us", "we", "our").
              </p>
              <p className="lead text-lg mb-8">
                Your access to and use of the Services is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Services.
              </p>
              <p className="lead text-lg mb-8">
                By accessing or using the Services, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Services.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4">1. Services Description</h2>
              <p>The SEO Hustler provides various SEO-related tools, resources, guides, and educational content, including but not limited to:</p>
              <ul className="list-disc pl-6 my-4 space-y-2">
                <li>Free SEO tools (On Page SEO Checker and others)</li>
                <li>Blog articles and educational content</li>
                <li>Downloadable resources and templates</li>
                <li>Premium courses and materials</li>
              </ul>

              <h2 className="text-2xl font-bold mt-10 mb-4">2. Account Registration</h2>
              <p>Some of our Services may require you to register for an account. When you register, you agree to provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer or device.</p>
              <p>You agree to accept responsibility for all activities that occur under your account. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>

              <h2 className="text-2xl font-bold mt-10 mb-4">3. Free and Premium Services</h2>
              <h3 className="text-xl font-semibold mt-6 mb-3">3.1 Free Services</h3>
              <p>Free services are provided "as is" without warranty of any kind. We reserve the right to modify, suspend, or discontinue free services at any time without notice.</p>
              <h3 className="text-xl font-semibold mt-6 mb-3">3.2 Premium Services</h3>
              <p>Premium services require payment. By purchasing premium services, you agree to pay all fees associated with the services you select. All purchases are final unless otherwise specified in our refund policy.</p>

              <h2 className="text-2xl font-bold mt-10 mb-4">4. Intellectual Property</h2>
              <h3 className="text-xl font-semibold mt-6 mb-3">4.1 Our Content</h3>
              <p>The Services and their original content, features, and functionality are and will remain the exclusive property of The SEO Hustler and its licensors. The Services are protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of The SEO Hustler.</p>
              <h3 className="text-xl font-semibold mt-6 mb-3">4.2 User Content</h3>
              <p>When you provide content through our Services ("User Content"), you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such content in connection with providing and promoting the Services.</p>
              <p>You represent and warrant that:</p>
              <ul className="list-disc pl-6 my-4 space-y-2">
                <li>You own or have the right to use and authorize us to use your User Content</li>
                <li>The User Content does not violate the rights of any third party</li>
                <li>The User Content does not contain any material that is false, defamatory, or misleading</li>
              </ul>

              <h2 className="text-2xl font-bold mt-10 mb-4">5. Acceptable Use</h2>
              <p>You agree not to use the Services:</p>
              <ul className="list-disc pl-6 my-4 space-y-2">
                <li>In any way that violates any applicable federal, state, local, or international law or regulation</li>
                <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors</li>
                <li>To transmit any material that is defamatory, obscene, invasive of another's privacy, hateful, or otherwise objectionable</li>
                <li>To impersonate or attempt to impersonate The SEO Hustler, an employee, another user, or any other person or entity</li>
                <li>To engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Services</li>
                <li>To attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the Services</li>
                <li>To use any robot, spider, or other automatic device, process, or means to access the Services for any purpose</li>
                <li>To introduce any viruses, trojan horses, worms, logic bombs, or other material which is malicious or technologically harmful</li>
              </ul>

              <h2 className="text-2xl font-bold mt-10 mb-4">6. Third-Party Links and Services</h2>
              <p>The Services may contain links to third-party websites or services that are not owned or controlled by The SEO Hustler. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.</p>
              <p>You acknowledge and agree that The SEO Hustler shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such websites or services.</p>

              <h2 className="text-2xl font-bold mt-10 mb-4">7. Disclaimer of Warranties</h2>
              <p>The Services are provided on an "AS IS" and "AS AVAILABLE" basis. The SEO Hustler makes no warranties, expressed or implied, regarding the operation of the Services or the information, content, materials, or products included.</p>
              <p>We do not guarantee that:</p>
              <ul className="list-disc pl-6 my-4 space-y-2">
                <li>The Services will meet your specific requirements</li>
                <li>The Services will be uninterrupted, timely, secure, or error-free</li>
                <li>The results that may be obtained from the use of the Services will be accurate or reliable</li>
                <li>The quality of any products, services, information, or other material purchased or obtained by you through the Services will meet your expectations</li>
              </ul>

              <h2 className="text-2xl font-bold mt-10 mb-4">8. Limitation of Liability</h2>
              <p>In no event shall The SEO Hustler, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:</p>
              <ul className="list-disc pl-6 my-4 space-y-2">
                <li>Your access to or use of or inability to access or use the Services</li>
                <li>Any conduct or content of any third party on the Services</li>
                <li>Any content obtained from the Services</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content</li>
              </ul>
              <p>The total liability of The SEO Hustler for any claim arising out of or relating to these Terms or our Services, regardless of the form of the action, is limited to the amount paid, if any, by you to The SEO Hustler for the Services in the 12 months prior to the claim.</p>

              <h2 className="text-2xl font-bold mt-10 mb-4">9. Indemnification</h2>
              <p>You agree to defend, indemnify, and hold harmless The SEO Hustler and its licensees and licensors, and their employees, contractors, agents, officers, and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees), resulting from or arising out of:</p>
              <ul className="list-disc pl-6 my-4 space-y-2">
                <li>Your use and access of the Services</li>
                <li>Your violation of any term of these Terms</li>
                <li>Your violation of any third-party right, including without limitation any copyright, property, or privacy right</li>
                <li>Any claim that your User Content caused damage to a third party</li>
              </ul>

              <h2 className="text-2xl font-bold mt-10 mb-4">10. Changes to Terms</h2>
              <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
              <p>By continuing to access or use our Services after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Services.</p>

              <h2 className="text-2xl font-bold mt-10 mb-4">11. Governing Law</h2>
              <p>These Terms shall be governed and construed in accordance with the Brazilian laws, without regard to its conflict of law provisions.</p>

              <h2 className="text-2xl font-bold mt-10 mb-4">12. Termination</h2>
              <p>We may terminate or suspend access to our Services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
              <p>All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.</p>

              <h2 className="text-2xl font-bold mt-10 mb-4">13. Contact Us</h2>
              <p>If you have any questions about these Terms, please contact us at:</p>
              <address className="not-italic mt-4">
                <strong>The SEO Hustler</strong>
                <br />
                Almeida & Almeida SEO, Content and AI LTDA.
                <br />
                Avenida Paulista 1106 - Sala 01, 16º Andar
                <br />
                São Paulo/SP
                <br />
                01310-914
                <br />
                Brazil
                <br />
                Email: <a href="mailto:contact@theseohustler.com">contact@theseohustler.com</a>
              </address>
            </div>

            <div className="mt-12 border-t border-outline/20 pt-8 text-center">
              <p className="mb-6">
                By using our Services, you acknowledge that you have read,
                understood, and agree to be bound by these Terms.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/privacy">
                  <Button variant="secondary" size="lg">
                    Privacy Policy
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" className="bg-primary text-on-primary">
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
