'use client'

import { useState, useEffect, useRef } from 'react';

export default function HeroTemplate({ children, className, noBg = false }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePosition({ x, y });
      }
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      heroElement.addEventListener('mouseenter', handleMouseEnter);
      heroElement.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (heroElement) {
        heroElement.removeEventListener('mousemove', handleMouseMove);
        heroElement.removeEventListener('mouseenter', handleMouseEnter);
        heroElement.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  // Generate dynamic grid pattern based on mouse position
  const generateGridPattern = () => {
    const gridSize = 40;
    const highlightRadius = 150;
    const maxOpacity = 1;
    const baseOpacity = 0.3;

    // Use static dimensions for SSR, dynamic for client
    const width = isClient ? window.innerWidth : 1200;
    const height = isClient ? window.innerHeight : 800;
    const cols = Math.ceil(width / gridSize);
    const rows = Math.ceil(height / gridSize);

    return (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        {Array.from({ length: cols + 1 }, (_, i) => {
          const x = i * gridSize;
          const distanceFromMouse = Math.abs(x - mousePosition.x);
          const opacity = Math.max(
            baseOpacity,
            isHovering && distanceFromMouse < highlightRadius
              ? maxOpacity * (1 - distanceFromMouse / highlightRadius)
              : baseOpacity
          );

          return (
            <line
              key={`v${i}`}
              x1={x}
              y1="0"
              x2={x}
              y2={height}
              className='stroke-foreground dark:stroke-primary'
              strokeWidth="0.65"
              opacity={opacity}
            />
          );
        })}
        {Array.from({ length: rows + 1 }, (_, i) => {
          const y = i * gridSize;
          const distanceFromMouse = Math.abs(y - mousePosition.y);
          const opacity = Math.max(
            baseOpacity,
            isHovering && distanceFromMouse < highlightRadius
              ? maxOpacity * (1 - distanceFromMouse / highlightRadius)
              : baseOpacity
          );

          return (
            <line
              key={`h${i}`}
              x1="0"
              y1={y}
              x2={width}
              y2={y}
              className='stroke-foreground dark:stroke-primary'
              strokeWidth="0.65"
              opacity={opacity}
            />
          );
        })}
      </svg>
    );
  };

  // Static pattern for SSR
  const generateStaticPattern = () => {
    return (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className='opacity-30'>
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFDD00" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    );
  };

  return (
    <div
      ref={heroRef}
      className={`pt-24 pb-16 md:pt-32 md:pb-24 ${noBg ? '' : 'bg-gradient-to-br from-[#4e503a] to-black'} relative overflow-hidden ${className}`}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30">
        {isClient ? generateGridPattern() : generateStaticPattern()}
      </div>

      {/* Yellow accent shapes */}
      {/* <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full opacity-10 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary rounded-full opacity-10 translate-y-1/2 -translate-x-1/3"></div> */}

      {children}
    </div>
  );
}
