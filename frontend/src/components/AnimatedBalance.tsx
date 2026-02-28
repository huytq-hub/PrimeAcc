"use client";

import { useEffect, useState, useRef } from "react";

interface AnimatedBalanceProps {
  value: number;
  duration?: number; // milliseconds
  className?: string;
}

/**
 * AnimatedBalance Component
 * 
 * Displays a number that smoothly animates when the value changes.
 * Uses Liquid Glass style: 400-600ms fluid animations with ease-out.
 * 
 * Features:
 * - Smooth number counting animation
 * - Color transition (green for increase, red for decrease)
 * - Respects prefers-reduced-motion
 * - Optimized with requestAnimationFrame
 */
export default function AnimatedBalance({ value, duration = 500, className = "" }: AnimatedBalanceProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef(value);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion || value === displayValue) {
      setDisplayValue(value);
      return;
    }

    // Determine direction for color animation
    if (value > displayValue) {
      setDirection('up');
    } else if (value < displayValue) {
      setDirection('down');
    }

    setIsAnimating(true);
    startValueRef.current = displayValue;
    startTimeRef.current = null;

    // Easing function: ease-out cubic
    const easeOutCubic = (t: number): number => {
      return 1 - Math.pow(1 - t, 3);
    };

    const animate = (currentTime: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      const currentValue = startValueRef.current + (value - startValueRef.current) * easedProgress;
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
        setIsAnimating(false);
        setDirection(null);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  // Format number with thousand separators
  const formattedValue = Math.round(displayValue).toLocaleString('vi-VN');

  return (
    <span 
      className={`
        ${className}
        transition-colors duration-500 ease-out
        ${isAnimating && direction === 'down' ? 'text-red-500' : ''}
        ${isAnimating && direction === 'up' ? 'text-green-500' : ''}
      `}
      style={{
        // Add subtle scale animation for emphasis
        transform: isAnimating ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {formattedValue}đ
    </span>
  );
}
