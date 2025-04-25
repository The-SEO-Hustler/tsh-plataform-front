"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import FeatureSection from "@/components/FeatureSection";
import Container from "../container";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";


export default function Contact() {
  const initValues = { name: "", email: "", message: "" };
  const [formData, setFormData] = useState(initValues);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  async function saveToNotion(formDataWithToken) {
    try {
      console.log("Sending form data with token:", JSON.stringify(formDataWithToken));

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

    const formDataWithToken = { ...formData, token, form: 'contact' };

    await saveToNotion(formDataWithToken);

    setIsLoading(false);
  };

  // FAQ content
  const faqItems = [
    {
      question: "How quickly will I get a response?",
      answer:
        "We aim to respond to all inquiries within 24-48 business hours. For urgent matters related to course access or technical issues with our tools, we typically respond even faster.",
    },
    {
      question: "I have a question about a specific tool or resource.",
      answer:
        "For the fastest response, please include the name of the tool or resource in your subject line. This helps us route your question to the right team member.",
    },

    {
      question: "Can I guest post on your blog?",
      answer:
        'We selectively accept guest contributions from experts with proven experience. Please use the form with "Guest Post Pitch" and include your proposed topic and relevant writing samples.',
    },
    {
      question: "I found a technical issue on your website.",
      answer:
        "We appreciate you taking the time to report it! Please include the URL where you encountered the issue, steps to reproduce it, and screenshots if possible.",
    },
  ];

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
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-yellow-400"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <Container className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Get in <span className="text-yellow-400">Touch</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Questions, feedback, partnership inquiries? We're here to help.
          </p>
        </Container>
      </section>

      {/* Contact Form and Info Section */}
      <FeatureSection>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold mb-6">How Can We Help?</h2>
            <p className="mb-8 text-gray-600">
              Whether you need help with our tools, have questions about our
              courses, or want to explore partnership opportunities, we're here
              to assist. Fill out the form and we'll get back to you as soon as
              possible.
            </p>

            <div className="space-y-6 mb-12">
              <div className="flex items-start">
                <div className="bg-yellow-400/10 p-3 rounded-md mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-yellow-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Email Us</h3>
                  <p className="text-gray-600">
                    <a href="mailto:contact@theseohustler.com">
                      contact@theseohustler.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-yellow-400/10 p-3 rounded-md mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-yellow-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Live Chat</h3>
                  <p className="text-gray-600">
                    Available Monday-Friday, 9am-5pm EST
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-400 p-6 rounded-lg transform -rotate-1">
              <div className="transform rotate-1">
                <h3 className="font-bold text-lg mb-2 text-gray-900">
                  Need Immediate Help?
                </h3>
                <p className="text-gray-900 mb-4">
                  Check out our comprehensive knowledge base for instant answers
                  to common questions.
                </p>
                <Button href="/resources" variant="secondary" size="default">
                  Browse Knowledge Base
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-lg md:p-8 p-6 shadow-md">
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>

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
                    Send Another Message
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

      {/* FAQ Section */}
      <section className="py-20 bg-[#ffcc00]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div key={index} className="bg-white rounded-md p-6 shadow-md">
                  <h3 className="font-bold text-lg mb-2">{item.question}</h3>
                  <p className="text-on-surface-variant">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Map Section - would typically include an embedded map */}
      {/* <section className="bg-surface-variant py-16">
        <Container>
          <div className="relative overflow-hidden rounded-shape-large shadow-elevation-1 h-96 bg-gray-200">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-primary mx-auto"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <h3 className="font-bold text-lg">
                  The SEO Hustler Headquarters
                </h3>
                <p className="text-on-surface-variant">
                  123 Digital Avenue, Boston, MA 02110
                </p>
              </div>
            </div>
    </div >
        </Container >
      </section > */}
    </>
  );
}
