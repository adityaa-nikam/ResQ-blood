
import { useEffect, useRef, useState } from 'react';

// Animation options interface
interface AnimationOptions {
  threshold?: number;
  animation?: string;
  delay?: number;
  duration?: number;
  rootMargin?: string;
}

// Default animation values
const defaultOptions = {
  threshold: 0.2,
  animation: 'fade-in',
  delay: 0,
  duration: 700,
  rootMargin: '0px',
};

/**
 * Custom hook for triggering animations when elements scroll into view
 */
export const useScrollAnimation = (options: Partial<AnimationOptions> = {}) => {
  const mergedOptions = { ...defaultOptions, ...options };
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(currentRef);
          }
        });
      },
      {
        threshold: mergedOptions.threshold,
        rootMargin: mergedOptions.rootMargin,
      }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [mergedOptions.threshold, mergedOptions.rootMargin]);

  const animationStyle = isVisible
    ? {
        opacity: 1,
        transform: 'translateY(0)',
        transition: `opacity ${mergedOptions.duration}ms ease, transform ${mergedOptions.duration}ms ease`,
        transitionDelay: `${mergedOptions.delay}ms`,
      }
    : {
        opacity: 0,
        transform: 'translateY(20px)',
        transition: `opacity ${mergedOptions.duration}ms ease, transform ${mergedOptions.duration}ms ease`,
      };

  return { ref, isVisible, animationStyle };
};

/**
 * Custom hook for adding hover animations to elements
 */
export const useHoverAnimation = (scale = 1.05, duration = 300) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handlers = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    onFocus: () => setIsHovered(true),
    onBlur: () => setIsHovered(false),
  };

  const style = {
    transform: isHovered ? `scale(${scale})` : 'scale(1)',
    transition: `transform ${duration}ms ease-out`,
  };

  return { isHovered, handlers, style };
};

/**
 * Custom hook for pulsating animation
 */
export const usePulse = (initialActive = false, interval = 1500) => {
  const [isPulsing, setIsPulsing] = useState(initialActive);
  
  useEffect(() => {
    if (!initialActive) return;
    
    const timer = setInterval(() => {
      setIsPulsing(prev => !prev);
    }, interval);
    
    return () => clearInterval(timer);
  }, [initialActive, interval]);
  
  return { isPulsing };
};

/**
 * Custom hook for counting up numbers
 */
export const useCountUp = (
  endValue: number,
  duration = 2000,
  delay = 0,
  startValue = 0
) => {
  const [count, setCount] = useState(startValue);
  const ref = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const countRef = useRef<number | null>(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.unobserve(currentRef);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    if (!isInView) return;

    // Clear any existing animation
    if (countRef.current !== null) {
      window.cancelAnimationFrame(countRef.current);
    }

    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Apply delay
      if ((timestamp - startTime) < delay) {
        countRef.current = window.requestAnimationFrame(step);
        return;
      }
      
      // Calculate progress after delay
      const delayedProgress = Math.max(0, Math.min((timestamp - startTime - delay) / duration, 1));
      
      setCount(Math.floor(startValue + delayedProgress * (endValue - startValue)));
      
      if (delayedProgress < 1) {
        countRef.current = window.requestAnimationFrame(step);
      } else {
        setCount(endValue);
      }
    };
    
    countRef.current = window.requestAnimationFrame(step);

    return () => {
      if (countRef.current !== null) {
        window.cancelAnimationFrame(countRef.current);
      }
    };
  }, [endValue, duration, delay, startValue, isInView]);

  return { count, ref };
};
