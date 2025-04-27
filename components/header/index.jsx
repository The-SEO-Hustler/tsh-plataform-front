"use client";

import React, { useState, useEffect } from "react";
import Container from "../container";
import { Button } from "@/components/ui/button";
import cn from "clsx";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, ChartArea, NotebookPen, FileCode } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // Add scroll listener to apply elevation to header on scroll
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);
  const checkPathname = () => {
    if (
      pathname === "/" ||
      pathname === "/free-tools" ||
      pathname === "/blog" ||
      pathname === "/resources" ||
      pathname === "/about" ||
      pathname === "/contact"
    ) {
      return true;
    } else {
      return false;
    }
  };
  const isSpecialPath = checkPathname();
  return (
    <header
      className={`bg-white backdrop-blur-sm shadow-elevation-2 text-black border-b border-gray-200 ${isSpecialPath ? "fixed" : "sticky"
        } ${isSpecialPath && !scrolled
          ? "!text-primary !backdrop-blur-none !bg-transparent !border-b-0"
          : "text-black"
        } z-[999] top-0 w-full font-semibold`}
    >
      <Container className="h-16 flex items-center justify-between">
        {/* Logo */}

        <Link href="/" className="flex items-center relative space-x-2 h-full">
          {isSpecialPath && !scrolled ? (
            <Image
              src="/the-seo-hustler-horizontal-white-logo.png"
              alt="The SEO Hustler logo"
              priority={true}
              width={180}
              height={41.25}
            />
          ) : (
            <Image
              src="/the-seo-hustler-horizontal-black.png"
              alt="The SEO Hustler logo"
              priority={true}
              width={180}
              height={41.25}
            />
          )}
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu
          className={`hidden md:flex 
          `}
          orientation="rtl"
        >
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="cursor-pointer"><Link href="/free-tools" className="!no-underline !font-bold">Free Tools</Link></NavigationMenuTrigger>
              <NavigationMenuContent orientation="ltr" dir="ltr" className="shadow-lg rounded-md">
                <ul className="flex flex-col gap-3 p-2">
                  <ListItem href="/seo-check" title="SEO Check On Page" free>
                    <div className="flex items-center space-x-3">
                      <svg width="20" height="20" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" className="min-w-5 min-h-5 rounded-md">
                        <path d="M35 17.5V12.25L26.25 3.5H10.5C9.57174 3.5 8.6815 3.86875 8.02513 4.52513C7.36875 5.1815 7 6.07174 7 7V35C7 35.9283 7.36875 36.8185 8.02513 37.4749C8.6815 38.1313 9.57174 38.5 10.5 38.5H17.5" stroke="black" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M24.5 3.5V10.5C24.5 11.4283 24.8687 12.3185 25.5251 12.9749C26.1815 13.6313 27.0717 14 28 14H35" stroke="black" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M26 29L28 31L32 27" stroke="black" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M29 37C33.4183 37 37 33.4183 37 29C37 24.5817 33.4183 21 29 21C24.5817 21 21 24.5817 21 29C21 33.4183 24.5817 37 29 37Z" stroke="black" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M39 39.0002L34.7 34.7002" stroke="black" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Provide an URL and get its SEO score</span>
                    </div>
                  </ListItem>
                  <ListItem href="/advanced-keyword-analysis" title="Advanced Keyword Analysis" free>
                    <div className="flex items-center space-x-3">
                      <ChartArea width={20} height={20} strokeWidth={1.5} className="min-w-5 min-h-5 rounded-md" color="black" />
                      <span>Provide a keyword and get its SEO insights</span>
                    </div>
                  </ListItem>
                  <ListItem href="/llms-txt-generator" title="LLMs.txt Generator" free>
                    <div className="flex items-center space-x-3">
                      <FileCode width={20} height={20} strokeWidth={1.5} className="min-w-5 min-h-5 rounded-md" color="black" />
                      <span>Create optimized LLMs.txt files in minutes, not hours. Control how AI sees and represents your business.</span>
                    </div>
                  </ListItem>
                  <ListItem href="/content-planning" title="Content Planning" free>
                    <div className="flex items-center space-x-3">
                      <NotebookPen width={20} height={20} strokeWidth={1.5} className="min-w-5 min-h-5 rounded-md" color="black" />
                      <span>Provide a keyword and we will give you a content plan</span>
                    </div>
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/about" legacyBehavior passHref className="!no-underline !font-bold">
                <NavigationMenuLink>About</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/resources" legacyBehavior passHref className="!no-underline !font-bold">
                <NavigationMenuLink>Resources</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/contact" legacyBehavior passHref className="!no-underline !font-bold">
                <NavigationMenuLink>Contact</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/blog" legacyBehavior passHref className="!no-underline !font-bold">
                <NavigationMenuLink>Blog</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Auth Buttons */}
        {/* <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost">Sign In</Button>
          <Button>Get Started</Button>
        </div> */}

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col space-y-4 mt-4 px-4">
              <SheetClose asChild>
                <Link href="/free-tools" className="text-sm  cursor-pointer !no-underline !font-bold">
                  Free Tools
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/seo-check" className="text-sm  flex items-center space-x-1 !no-underline !font-bold whitespace-nowrap">
                  <svg width="20" height="20" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M35 17.5V12.25L26.25 3.5H10.5C9.57174 3.5 8.6815 3.86875 8.02513 4.52513C7.36875 5.1815 7 6.07174 7 7V35C7 35.9283 7.36875 36.8185 8.02513 37.4749C8.6815 38.1313 9.57174 38.5 10.5 38.5H17.5" stroke="black" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M24.5 3.5V10.5C24.5 11.4283 24.8687 12.3185 25.5251 12.9749C26.1815 13.6313 27.0717 14 28 14H35" stroke="black" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M26 29L28 31L32 27" stroke="black" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M29 37C33.4183 37 37 33.4183 37 29C37 24.5817 33.4183 21 29 21C24.5817 21 21 24.5817 21 29C21 33.4183 24.5817 37 29 37Z" stroke="black" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M39 39.0002L34.7 34.7002" stroke="black" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>
                    SEO Check On Page
                  </span>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/advanced-keyword-analysis"
                  className="text-sm  flex items-center space-x-1 !no-underline !font-bold whitespace-nowrap"
                >
                  <ChartArea width={20} height={20} strokeWidth={1.5} className="min-w-5 min-h-5 rounded-md" />
                  <span>Advanced Keyword Analysis</span>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/content-planning" className="text-sm  flex items-center space-x-1 !no-underline !font-bold whitespace-nowrap">
                  <NotebookPen width={20} height={20} strokeWidth={1.5} className=" rounded-md" />
                  <span>Content Planning</span>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/llms-txt-generator" className="text-sm  flex items-center space-x-1 !no-underline !font-bold whitespace-nowrap">
                  <FileCode width={20} height={20} strokeWidth={1.5} className=" rounded-md" />
                  <span>LLMs.txt Generator</span>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/seo-check" className="text-sm  !no-underline !font-bold">

                  <span>SEO Check On Page</span>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/blog" className="text-sm  !no-underline !font-bold">
                  Blog
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/resources" className="text-sm  !no-underline !font-bold">
                  Resources
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/about" className="text-sm  !no-underline !font-bold">
                  About
                </Link>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </Container>
    </header>
  );
}
const ListItem = (
  { className, title, children, href, free = false, ...props },
  ref
) => {
  const pathname = usePathname();
  const [fullPath, setFullPath] = useState("");

  useEffect(() => {
    // Update the fullPath with pathname and hash
    setFullPath(window.location.pathname + window.location.hash);
  }, [pathname]);

  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none !no-underline !font-bold outline-none transition-colors bg-gray-100/50 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          href={href}
          {...props}
        >
          <div
            className={cn(
              "text-sm whitespace-nowrap  leading-none",
              // Compare full path (including hash) with href
            )}
          >
            {title}{" "}
            {free && <span className="ml-2 text-green-600 font-semibold">FREE</span>}
          </div>
          <div className="line-clamp-2 text-xs leading-snug text-[#555]">
            {children}
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  );
};

ListItem.displayName = "ListItem";

export default Header;
