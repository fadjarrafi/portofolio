"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollAnimateProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollAnimate({
  children,
  className = "",
  delay = 0,
}: ScrollAnimateProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Use a single observer instance
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Use requestAnimationFrame to batch DOM updates
          requestAnimationFrame(() => {
            setIsVisible(true);
          });
          // Disconnect after triggering to free resources
          observerRef.current?.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    observerRef.current.observe(element);

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      } ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        willChange: isVisible ? "auto" : "opacity, transform", // Performance hint
      }}
    >
      {children}
    </div>
  );
}
