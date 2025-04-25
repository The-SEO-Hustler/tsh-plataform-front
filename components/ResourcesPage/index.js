"use client"

import FeatureSection from "@/components/FeatureSection";
import ResourceCard from "@/components/ResourceCard";
import { Button } from "@/components/ui/button";
import Container from "../container";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function Resources({ resources }) {

  const initValues = { name: "", email: "", message: "" };
  const [formData, setFormData] = useState(initValues);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();
  // State for type filter

  // Resource types
  const types = [
    { id: "guides", label: "Guides" },
    { id: "ebooks", label: "Ebooks" },
    { id: "cheatsheets", label: "Cheatsheets" },
  ];



  async function saveToNotion(formDataWithToken) {
    try {
      console.log("Sending form data:", JSON.stringify(formDataWithToken));

      const response = await fetch("/api/submit-to-notion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formDataWithToken),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers));

      // Try to get the response text first for debugging
      const responseText = await response.text();
      console.log("Raw response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
        console.log("Parsed response:", data);
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        setFormError(
          "There was an error processing the server response. Please try again."
        );
        return;
      }

      if (response.ok) {
        setFormSubmitted(true);
        setFormData(initValues);
      } else {
        console.error("Error response:", data);
        setFormError(
          data.error || data.message || "There was an error sending your message. Please try again."
        );
      }
    } catch (error) {
      console.error("Network or other error:", error);
      setFormError(
        "There was an error sending your message. Please try again."
      );
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setIsLoading(true);
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      setFormError("Recaptcha not ready. Please try again later.");
      setIsLoading(false);
      return;
    }

    console.log("Executing reCAPTCHA...");
    const token = await executeRecaptcha("contact_form");
    console.log("reCAPTCHA token:", token);

    const formDataWithToken = { ...formData, token, form: 'resources' };
    await saveToNotion(formDataWithToken);

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#4e503a] to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-yellow-400" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            <span className="text-yellow-400">Free SEO Resources</span> & Templates
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Download actionable resources, cheatsheets, guides, and templates to streamline your SEO workflow and get results faster.
          </p>
        </div>
      </section>

      {/* Navigation */}
      <nav className="sticky top-16 z-20 bg-white border-b border-gray-200 shadow-sm ">
        <Container>
          <div className="flex overflow-x-auto no-scrollbar gap-3 py-4">
            {types.map((type) => (
              <a
                key={type.id}
                href={`#${type.id}`}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                {type.label}
              </a>
            ))}
          </div>
        </Container>
      </nav>

      {/* Resources Sections */}
      <div className="py-12 space-y-16">
        {/* General Resources Section */}
        {resources.guides.length > 0 && (
          <section id="guides" className="scroll-mt-24">
            <Container>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Guides</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.guides.map((resource, index) => (
                  <ResourceCard
                    key={index}
                    {...resource}
                  />
                ))}
              </div>
            </Container>
          </section>
        )}

        {/* Ebooks Section */}
        {resources.ebooks.length > 0 && (
          <section id="ebooks" className="scroll-mt-24">
            <Container>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Ebooks</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.ebooks.map((resource, index) => (
                  <ResourceCard
                    key={index}
                    {...resource}
                  />
                ))}
              </div>
            </Container>
          </section>
        )}

        {/* Cheatsheets Section */}
        {resources.spreadsheets.length > 0 && (
          <section id="cheatsheets" className="scroll-mt-24">
            <Container>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Cheatsheets</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.spreadsheets.map((resource, index) => (
                  <ResourceCard
                    key={index}
                    {...resource}
                  />
                ))}
              </div>
            </Container>
          </section>
        )}
      </div>

      {/* Premium Resources Callout */}
      {/* <section className="py-16 bg-primary">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-on-primary">
              Upgrade to Premium Resources
            </h2>
            <p className="text-lg mb-8 text-on-primary/90">
              Get access to our complete library of premium resources, including
              advanced guides, comprehensive ebooks, and professional templates.
            </p>
            <Button
              variant="secondary"
              size="lg"
              href="/premium"

            >
              View Premium Resources
            </Button>
          </div>
        </Container>
      </section> */}

      {/* Request Resources Section */}
      <FeatureSection
        title="Need a Specific Resource?"
        description="Can't find what you're looking for? Let us know what resources would help you the most, and we'll consider creating them."
        centered={true}
      >
        <div className="max-w-xl mx-auto">
          <div>
            <div className="bg-white rounded-lg p-8 shadow-md">
              <h2 className="text-2xl font-bold mb-6">Send a Resource Request</h2>

              {formSubmitted ? (
                <div className="bg-yellow-400/20 p-6 rounded-lg mb-4">
                  <h3 className="font-bold text-lg mb-2">Message Sent!</h3>
                  <p className="text-gray-600">
                    Thanks for reaching out. We've received your message and
                    will get back to you as soon as possible.
                  </p>
                  <Button
                    variant="secondary"
                    className="mt-4"
                    onClick={() => setFormSubmitted(false)}
                  >
                    Send Another Resource Request
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {formError && (
                    <div className="bg-red-100 p-4 rounded-md mb-6">
                      <p className="text-red-600">
                        There was an error sending your message. Please try
                        again.
                      </p>
                    </div>
                  )}

                  <div className="space-y-4 mb-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block mb-2 font-medium text-gray-700"
                      >
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block mb-2 font-medium text-gray-700"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block mb-2 font-medium text-gray-700"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Describe the resource you'd like us to create..."
                        rows="4"
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        required
                      ></textarea>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="default"
                    size="lg"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </FeatureSection>
    </div>
  );
}
