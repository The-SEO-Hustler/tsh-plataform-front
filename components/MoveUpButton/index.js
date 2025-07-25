"use client";

import React, { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const MoveUpButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Check if scrolling up
      if (currentScrollY < lastScrollY && currentScrollY > 300) {
        setIsScrollingUp(true);
        setIsVisible(true);
      } else {
        setIsScrollingUp(false);
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <Button
      onClick={scrollToTop}
      className={`fixed bottom-4 md:bottom-6 right-4 md:right-6 z-50 w-10 h-10 md:w-12 md:h-12 rounded-lg shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:scale-110 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      size="icon"
      aria-label="Scroll to top"
    >
      <ChevronUp className="h-5 w-5" />
    </Button>
  );
};

export default MoveUpButton; 