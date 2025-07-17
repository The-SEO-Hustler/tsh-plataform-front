"use client";

import React, { useState, useEffect } from "react";
import Container from "../container";
import { Button } from "@/components/ui/button";
import cn from "clsx";
import { tools } from "@/lib/toolsMetaData";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import useScrollDirection from "./scroll";

import {
  Menu,
  ChartArea,
  NotebookPen,
  FileCode,
  ScanSearch,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ThemeSwitch from "../ThemeSwitch";
import { useTheme } from "next-themes";
import styles from "./style.module.css";
function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // Add scroll listener to apply elevation to header on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    // 1) Attach once
    window.addEventListener("scroll", handleScroll, { passive: true });
    // 2) Call it once immediately, to pick up any existing scroll
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const checkScrollPath = () => {
    // Check if the path matches the pattern of a single post
    // e.g., /blog/post-name, /guides/guide-name, etc.
    const pathSegments = pathname.split('/').filter(Boolean);

    // Must have exactly 2 segments (category/post-name)
    if (pathSegments.length !== 2) return false;

    const [category, post] = pathSegments;

    // Check if it's one of our target categories
    const validCategories = ['blog', 'guides', 'playbooks', 'spreadsheets'];

    return validCategories.includes(category) && post.length > 0;
  };

  const isSpecialPath = checkPathname();
  const isScrollPath = checkScrollPath();
  const scrollDirection = useScrollDirection();

  return (
    <header
      className={`bg-background backdrop-blur-sm shadow-elevation-2 border-b border-border ${styles.header} 
        ${isSpecialPath ? "fixed" : "sticky"} 
        ${isSpecialPath && !scrolled ? `!text-primary !backdrop-blur-none !bg-transparent !border-b-0 ${styles.isSpecialPath} ${styles.notScrolled}` : "text-foreground"}
        ${isScrollPath ? styles.scrollHeader : ""}
        ${isScrollPath && scrollDirection === "down" ? styles.headerHidden : ""}
        z-[999] top-0 w-full font-semibold`}
    >
      <Container className="h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 h-full relative">
          {mounted &&
            ((isSpecialPath && !scrolled) || resolvedTheme === "dark" ? (
              <Image
                src="/the-seo-hustler-horizontal-white-logo.png"
                alt="The SEO Hustler logo"
                priority={true}
                className=""
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
            ))}
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu
          className={`hidden md:flex 
          `}
          orientation="rtl"
        >
          <NavigationMenuList >
            <NavigationMenuItem>
              <NavigationMenuTrigger className="cursor-pointer">
                <Link href="/free-tools" className="!no-underline !font-bold ">
                  Free Tools
                </Link>
              </NavigationMenuTrigger>
              <NavigationMenuContent
                orientation="ltr"
                dir="ltr"
                className="shadow-lg rounded-md"
              >
                <ul className="flex flex-col gap-3 p-2">
                  {tools.map((tool, index) => (
                    <ListItem href={tool.href} title={tool.title} key={index} free>
                      <div className="flex items-center space-x-3">
                        <span>{tool.description}</span>
                      </div>
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                href="/about"
                legacyBehavior
                passHref
                className="!no-underline !font-bold "
              >
                <NavigationMenuLink className="">About</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                href="/resources"
                legacyBehavior
                passHref
                className="!no-underline !font-bold "
              >
                <NavigationMenuLink className="">Resources</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                href="/contact"
                legacyBehavior
                passHref
                className="!no-underline !font-bold "
              >
                <NavigationMenuLink className="">Contact</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                href="/blog"
                legacyBehavior
                passHref
                className="!no-underline !font-bold "
              >
                <NavigationMenuLink className="">Blog</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
          <ThemeSwitch />
        </NavigationMenu>

        {/* Auth Buttons */}
        {/* <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost">Sign In</Button>
          <Button>Get Started</Button>
        </div> */}

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden !bg-card">
            <Button
              variant="ghost"
              size="icon"
              className="border border-border"
            >
              <Menu className="h-5 w-5 text-foreground" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="!text-foreground">Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col space-y-4 mt-4 px-4">
              <SheetClose asChild>
                <Link
                  href="/free-tools"
                  className="text-sm !text-foreground  cursor-pointer !no-underline !font-bold "
                >
                  Free Tools
                </Link>
              </SheetClose>
              {tools.map((tool, index) => (
                <SheetClose asChild key={index}>
                  <Link
                    href={tool.href}
                    className="text-sm !text-foreground  flex items-center space-x-1 !no-underline !font-bold whitespace-nowrap"
                  >
                    {tool.Icon && (
                      typeof tool.Icon === 'function' ? (
                        <tool.Icon className={cn(
                          "w-5 h-5 text-primary-foreground dark:text-foreground dark:fill-foreground"
                        )} />
                      ) : (
                        <div className="max-w-5 max-h-5 flex items-center justify-center text-primary-foreground dark:text-foreground dark:fill-foreground">
                          {tool.Icon}
                        </div>
                      )
                    )}

                    <span>{tool.title}</span>
                  </Link>
                </SheetClose>
              ))}



              <SheetClose asChild>
                <Link
                  href="/blog"
                  className="text-sm !text-foreground  !no-underline !font-bold"
                >
                  Blog
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/resources"
                  className="text-sm !text-foreground  !no-underline !font-bold"
                >
                  Resources
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/about"
                  className="text-sm !text-foreground  !no-underline !font-bold"
                >
                  About
                </Link>
              </SheetClose>
            </div>
            <SheetFooter className="flex justify-center">
              {/* Theme Switch */}
              <ThemeSwitch />
            </SheetFooter>
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
            "block select-none space-y-1 rounded-md p-3 leading-none !no-underline !font-bold outline-none transition-colors  hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          href={href}
          {...props}
        >
          <div
            className={cn(
              "text-sm whitespace-nowrap  leading-none !text-foreground"
              // Compare full path (including hash) with href
            )}
          >
            {title}{" "}
            {free && (
              <span className="ml-2 text-green-600 font-semibold">FREE</span>
            )}
          </div>
          <div className="line-clamp-2 text-xs leading-snug text-[#555] dark:text-foreground/60">
            {children}
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  );
};

ListItem.displayName = "ListItem";

export default Header;
