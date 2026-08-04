'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'scale-up';
  delayMs?: number;
  durationMs?: number;
}

export function ScrollReveal({
  children,
  className = '',
  animation = 'fade-up',
  delayMs = 0,
  durationMs = 700,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  const getAnimationStyles = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      transitionProperty: 'opacity, transform',
      transitionDuration: `${durationMs}ms`,
      transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      transitionDelay: `${delayMs}ms`,
      willChange: 'opacity, transform',
    };

    if (isVisible) {
      return {
        ...baseStyle,
        opacity: 1,
        transform: 'translate3d(0, 0, 0) scale(1)',
      };
    }

    switch (animation) {
      case 'fade-up':
        return { ...baseStyle, opacity: 0, transform: 'translate3d(0, 40px, 0)' };
      case 'fade-down':
        return { ...baseStyle, opacity: 0, transform: 'translate3d(0, -40px, 0)' };
      case 'fade-left':
        return { ...baseStyle, opacity: 0, transform: 'translate3d(40px, 0, 0)' };
      case 'fade-right':
        return { ...baseStyle, opacity: 0, transform: 'translate3d(-40px, 0, 0)' };
      case 'zoom-in':
      case 'scale-up':
        return { ...baseStyle, opacity: 0, transform: 'scale(0.92)' };
      default:
        return { ...baseStyle, opacity: 0, transform: 'translate3d(0, 40px, 0)' };
    }
  };

  return (
    <div ref={ref} style={getAnimationStyles()} className={className}>
      {children}
    </div>
  );
}
