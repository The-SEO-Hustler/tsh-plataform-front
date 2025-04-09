"use client";

import React, { useState, useEffect } from "react";
import Container from "../container";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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
      className={`bg-white shadow-elevation-2 text-black border-b border-gray-200 ${isSpecialPath ? "fixed" : "sticky"
        } ${isSpecialPath && !scrolled
          ? "!text-primary !bg-transparent !border-b-0"
          : "text-black"
        } z-[999] top-0 w-full font-bold`}
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
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
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
              <Link href="/free-tools" legacyBehavior passHref>
                <NavigationMenuLink>Free Tools</NavigationMenuLink>
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
              <Link href="/free-tools" className="text-sm font-medium">
                Free Tools
              </Link>
              <Link
                href="/seo-check"
                className="text-sm font-medium"
              >
                SEO Check On Page
              </Link>
              <Link href="/blog" className="text-sm font-medium">
                Blog
              </Link>
              <Link href="/resources" className="text-sm font-medium">
                Resources
              </Link>
              <Link href="/about" className="text-sm font-medium">
                About
              </Link>

            </div>
          </SheetContent>
        </Sheet>
      </Container>
    </header>
  );
}

export default Header;
