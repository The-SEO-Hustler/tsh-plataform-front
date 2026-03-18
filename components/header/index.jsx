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
    const pathSegments = pathname.split("/").filter(Boolean);

    // Must have exactly 2 segments (category/post-name)
    if (pathSegments.length !== 2) return false;

    const [category, post] = pathSegments;

    // Check if it's one of our target categories
    const validCategories = ["blog", "guides", "playbooks", "spreadsheets"];

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
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="cursor-pointer">
                <Link href="/free-tools" className="!no-underline !font-bold ">
                  Free Tools
                </Link>
              </NavigationMenuTrigger>
              <NavigationMenuContent
                orientation="ltr"
                dir="ltr"
                className="shadow-lg rounded-md md:right-0 md:left-auto w-[calc(100vw-2rem)] sm:w-[520px] lg:w-[640px] max-w-[calc(100vw-2rem)] overflow-hidden"
              >
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 w-full max-h-[calc(100vh-7rem)] overflow-y-auto">
                  {tools.map((tool, index) => {
                    const shortDescription = String(tool.description || "")
                      .split(".")
                      .filter(Boolean)[0];
                    return (
                      <ListItem
                        href={tool.href}
                        title={tool.title}
                        key={index}
                        icon={tool.Icon}
                      >
                        {shortDescription ? `${shortDescription}.` : ""}
                      </ListItem>
                    );
                  })}
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
                    {tool.Icon &&
                      (typeof tool.Icon === "function" ? (
                        <tool.Icon
                          className={cn(
                            "w-5 h-5 text-primary-foreground dark:text-foreground dark:fill-foreground",
                          )}
                        />
                      ) : (
                        <div className="max-w-5 max-h-5 flex items-center justify-center text-primary-foreground dark:text-foreground dark:fill-foreground">
                          {tool.Icon}
                        </div>
                      ))}

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
  { className, title, children, href, free = false, icon = null, ...props },
  ref,
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
            "block select-none rounded-md p-3 !no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          href={href}
          {...props}
        >
          <div className="flex items-start gap-3">
            {icon ? (
              <div className="shrink-0 rounded-md bg-primary/10 text-primary p-2 [&_svg]:w-5 [&_svg]:h-5">
                {icon}
              </div>
            ) : null}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="text-sm font-bold leading-none !text-foreground truncate">
                  {title}
                </div>
                {free && (
                  <span className="text-[10px] leading-none px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300 border border-green-200 dark:border-green-800">
                    FREE
                  </span>
                )}
              </div>
              <div className="line-clamp-1 text-xs leading-snug text-[#555] dark:text-foreground/60 mt-1">
                {children}
              </div>
            </div>
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  );
};

ListItem.displayName = "ListItem";

export default Header;
