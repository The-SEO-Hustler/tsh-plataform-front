import React from "react";
import Container from "../container";
import { Button } from "@/components/ui/button";
import { Github, Twitter } from "lucide-react";
import Link from "next/link";

function Footer() {
  return (
    <footer className="border-t py-8 text-primary">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <svg
                width="32"
                height="32"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M39.2001 32C45.8275 32 51.2001 26.6274 51.2001 20C51.2001 13.3726 45.8275 8 39.2001 8C32.9802 8 27.8656 12.7321 27.2601 18.7925C24.8084 17.6836 22.1597 17.0209 19.4473 16.8465C20.9595 7.29911 29.2274 0 39.2001 0C50.2458 0 59.2001 8.95431 59.2001 20C59.2001 30.6428 50.887 39.344 40.4 39.9646V40H27.2195V38.2545C27.2195 35.987 26.2844 33.7821 24.5705 32.1336C22.8517 30.4804 20.4908 29.5273 18 29.5273C15.5092 29.5273 13.1483 30.4804 11.4295 32.1336C9.71564 33.7821 8.78049 35.987 8.78049 38.2545V40H0V38.2118C0 33.5371 1.94004 29.0906 5.33341 25.8398C8.61822 22.693 13.0047 20.9102 17.5711 20.805C17.7139 20.8017 17.8569 20.8 18 20.8C18.1108 20.8 18.2215 20.801 18.3322 20.803C22.9333 20.8851 27.3586 22.6707 30.6666 25.8398C32.4991 27.5953 33.9078 29.6995 34.8159 32H39.2001Z"
                  fill="currentColor"
                />
              </svg>
              <span className="font-bold">SEO Check</span>
            </Link>
            <p className="text-sm text-foreground">
              Comprehensive SEO analysis and optimization tools for your
              website.
            </p>
          </div>

          <div className="md:justify-self-center ">
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/seo-audit"
                  className="text-foreground hover:text-muted-foreground"
                >
                  SEO Audit
                </Link>
              </li>
              <li>
                <Link
                  href="/reports"
                  className="text-foreground hover:text-muted-foreground"
                >
                  Reports
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-foreground hover:text-muted-foreground"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:justify-self-center ">
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-foreground hover:text-muted-foreground"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-foreground hover:text-muted-foreground"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-foreground hover:text-muted-foreground"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:justify-self-center">
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <Button size="icon">
                <Github className="h-4 w-4" />
              </Button>
              <Button size="icon">
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-foreground">
          <p>© {new Date().getFullYear()} SEO Check. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
