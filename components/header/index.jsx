"use client";

import React, { useState, useEffect } from "react";
import Container from "../container";
import { Button } from "@/components/ui/button";
import cn from 'clsx'
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
import { Menu } from "lucide-react";
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
        <NavigationMenu className="hidden md:flex md:!max-w-[600px] lg:!max-w-[700px] !w-full" orientation="rtl">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Free Tools</NavigationMenuTrigger>
              <NavigationMenuContent orientation="ltr" dir="ltr">
                <ul className="grid gap-3 p-6 md:w-[600px] lg:w-[700px] lg:grid-cols-[1.2fr_1fr_1fr]">
                  <li className="row-span-2">
                    <NavigationMenuLink asChild>

                      <a
                        className="flex h-full w-full select-none flex-col justify-center rounded-md bg-gradient-to-b from-muted/50 to-gray-100 p-6 no-underline outline-none focus:shadow-md"
                        href="/free-tools"
                      >
                        <svg className="feather feather-tool" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
                        <div className="mb-2 mt-4 text-lg font-medium">
                          TSH FREE Tools
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          The SEO Hustler Tools, get better insights of today&apos;s keyword
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/seo-check" title="SEO Check On Page">
                    Provide an url and get its SEO score
                  </ListItem>
                  <ListItem href="/advanced-keyword-analysis" title="Advanced Keyword Analysis">
                    Provide a keyword and get its SEO insights
                  </ListItem>
                  <ListItem href="/content-planning" title="Content Planning">
                    Provide a keyword and we will give you a content plan
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/about" legacyBehavior passHref>
                <NavigationMenuLink>About</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/resources" legacyBehavior passHref>
                <NavigationMenuLink>Resources</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/contact" legacyBehavior passHref>
                <NavigationMenuLink>Contact</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/blog" legacyBehavior passHref>
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

                <Link href="/free-tools" className="text-sm font-medium">
                  Free Tools
                </Link>
              </SheetClose>
              <SheetClose asChild>

                <Link href="/seo-check" className="text-sm font-medium">
                  SEO Check On Page
                </Link>
              </SheetClose>
              <SheetClose asChild>

                <Link href="/advanced-keyword-analysis" className="text-sm font-medium">
                  Advanced Keyword Analysis
                </Link>
              </SheetClose>
              <SheetClose asChild>

                <Link href="/content-planning" className="text-sm font-medium">
                  Content Planning
                </Link>
              </SheetClose>
              <SheetClose asChild>

                <Link href="/seo-check" className="text-sm font-medium">

                  SEO Check On Page
                </Link>
              </SheetClose>
              <SheetClose asChild>

                <Link href="/blog" className="text-sm font-medium">
                  Blog
                </Link>
              </SheetClose>
              <SheetClose asChild>

                <Link href="/resources" className="text-sm font-medium">
                  Resources
                </Link>
              </SheetClose>
              <SheetClose asChild>

                <Link href="/about" className="text-sm font-medium">
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
const ListItem = (({ className, title, children, href, free = false, ...props }, ref) => {
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
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors bg-gray-100 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          href={href}
          {...props}
        >
          <div
            className={cn(
              "text-sm whitespace-nowrap font-medium leading-none",
              { 'text-[#ffc000]': fullPath === href } // Compare full path (including hash) with href
            )}
          >
            {title} {free && <span className='text-green-400 font-semibold'>FREE</span>}
          </div>
          <p className="line-clamp-2 text-xs leading-snug text-[#555]">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});

ListItem.displayName = "ListItem";



export default Header;
