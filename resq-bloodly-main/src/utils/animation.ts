
import { useEffect, useState, useRef } from 'react';

// Hook to handle scroll animations
export const useScrollAnimation = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  return { ref, isVisible };
};

// Hook for animated counter with improved easing
export const useCountUp = (end: number, duration = 2000, delay = 0) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const { ref, isVisible } = useScrollAnimation(0.5);

  useEffect(() => {
    if (!isVisible) return;

    let startTimestamp: number;
    const startValue = 0;
    
    // Improved easing function for smoother animation
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const currentCount = Math.floor(easedProgress * (end - startValue) + startValue);
      
      setCount(currentCount);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    const timeoutId = setTimeout(() => {
      window.requestAnimationFrame(step);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [end, duration, delay, isVisible]);

  return { count, ref: ref as React.RefObject<HTMLDivElement>, countRef };
};

// Enhanced hook for parallax effect with depth control
export const useParallax = (depth = 0.1) => {
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const { top } = ref.current.getBoundingClientRect();
      const scrollPos = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Calculate parallax effect with configurable depth
      if (top < windowHeight && top + ref.current.offsetHeight > 0) {
        const newOffset = (top - windowHeight) * depth;
        setOffset(newOffset);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [depth]);

  return { ref, style: { transform: `translateY(${offset}px)` } };
};

// Hook for typing animation with cursor options
export const useTypingEffect = (text: string, speed = 100, showCursor = true) => {
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (index < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayText((prev) => prev + text.charAt(index));
        setIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeoutId);
    } else {
      setIsComplete(true);
    }
  }, [index, speed, text]);

  return { 
    displayText, 
    isComplete,
    typingClass: showCursor ? 'typing-text' : ''
  };
};

// New hook for 3D tilt effect
export const useTiltEffect = (maxTilt = 15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: 'transform 0.1s ease'
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;
      
      setTiltStyle({
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
        transition: 'transform 0.1s ease'
      });
    };
    
    const handleMouseLeave = () => {
      setTiltStyle({
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: 'transform 0.5s ease'
      });
    };
    
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [maxTilt]);
  
  return { ref, style: tiltStyle };
};

// New hook for glitch text effect
export const useGlitchEffect = (interval = 3000, duration = 200) => {
  const [isGlitching, setIsGlitching] = useState(false);
  
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      
      setTimeout(() => {
        setIsGlitching(false);
      }, duration);
    }, interval);
    
    return () => clearInterval(glitchInterval);
  }, [interval, duration]);
  
  const glitchClass = isGlitching ? 'text-glitch' : '';
  
  return { isGlitching, glitchClass };
};

// New hook for scroll-based reveal animations
export const useRevealAnimation = (direction: 'left' | 'right' | 'up' | 'down' = 'up', delay = 0) => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  
  const getAnimationClass = () => {
    if (!isVisible) {
      return 'opacity-0 transform ' + 
        (direction === 'left' ? 'translate-x-10' : 
         direction === 'right' ? '-translate-x-10' : 
         direction === 'up' ? 'translate-y-10' : 
         '-translate-y-10');
    }
    
    let baseClass = 'transition-all duration-700 opacity-100 transform translate-x-0 translate-y-0';
    if (delay) {
      baseClass += ` delay-[${delay}ms]`;
    }
    
    return baseClass;
  };
  
  return { ref, animationClass: getAnimationClass() };
};

// New hook for magnetic button effect
export const useMagneticEffect = (strength = 30) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = button.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      
      const centerX = width / 2;
      const centerY = height / 2;
      
      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;
      
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // Only apply effect when mouse is close enough
      if (distance < 1) {
        const translateX = deltaX * strength;
        const translateY = deltaY * strength;
        
        button.style.transform = `translate(${translateX}px, ${translateY}px)`;
      }
    };
    
    const handleMouseLeave = () => {
      button.style.transform = 'translate(0, 0)';
    };
    
    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);
  
  return buttonRef;
};

// New hook for floating cloud animation
export const useFloatingAnimation = (
  xRange = 20, 
  yRange = 10, 
  duration = 6000
) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({});
  
  useEffect(() => {
    if (!elementRef.current) return;
    
    const generateRandomPosition = () => {
      const xOffset = Math.random() * xRange - xRange / 2;
      const yOffset = Math.random() * yRange - yRange / 2;
      const rotateOffset = Math.random() * 10 - 5;
      
      setStyle({
        transform: `translate(${xOffset}px, ${yOffset}px) rotate(${rotateOffset}deg)`,
        transition: `transform ${duration / 1000}s ease-in-out`
      });
    };
    
    generateRandomPosition();
    const interval = setInterval(generateRandomPosition, duration);
    
    return () => clearInterval(interval);
  }, [xRange, yRange, duration]);
  
  return { ref: elementRef, style };
};

// New hook for animated gradient background
export const useAnimatedGradient = (
  colors: string[] = ['#ff3366', '#ba66ff', '#66a6ff', '#66ffd9'], 
  duration = 10000
) => {
  const [gradientStyle, setGradientStyle] = useState({
    backgroundImage: `linear-gradient(135deg, ${colors.join(', ')})`,
    backgroundSize: '300% 300%',
    animation: `gradientAnimation ${duration / 1000}s ease infinite`
  });
  
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      @keyframes gradientAnimation {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  return gradientStyle;
};

// New hook for scrolling text marquee
export const useMarquee = (speed = 50, reverse = false) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const content = container.children[0] as HTMLElement;
    if (!content) return;
    
    // Clone content for seamless scrolling
    container.appendChild(content.cloneNode(true));
    
    let scrollPosition = 0;
    const direction = reverse ? -1 : 1;
    
    const animate = () => {
      if (!container) return;
      
      scrollPosition += direction * (speed / 60);
      
      // Reset position when we've scrolled one full width
      const contentWidth = content.offsetWidth;
      if (Math.abs(scrollPosition) >= contentWidth) {
        scrollPosition = 0;
      }
      
      container.style.transform = `translateX(${scrollPosition}px)`;
      requestAnimationFrame(animate);
    };
    
    const animation = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animation);
  }, [speed, reverse]);
  
  return containerRef;
};

// New hook for scroll-triggered appearance animations with options
export const useScrollTrigger = (
  options = { 
    threshold: 0.1, 
    animation: 'fade-up', // 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom', 'flip'
    delay: 0,
    duration: 700
  }
) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: options.threshold }
    );
    
    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options.threshold]);
  
  const getAnimationClass = () => {
    if (!isVisible) {
      switch (options.animation) {
        case 'fade-up':
          return 'opacity-0 translate-y-10';
        case 'fade-down':
          return 'opacity-0 -translate-y-10';
        case 'fade-left':
          return 'opacity-0 translate-x-10';
        case 'fade-right':
          return 'opacity-0 -translate-x-10';
        case 'zoom':
          return 'opacity-0 scale-90';
        case 'flip':
          return 'opacity-0 rotate-y-90';
        default:
          return 'opacity-0';
      }
    }
    
    return 'opacity-100 translate-y-0 translate-x-0 scale-100 rotate-y-0';
  };
  
  const animationStyle = {
    transition: `all ${options.duration}ms ease-out ${options.delay}ms`,
    transform: isVisible ? undefined : 'translateY(20px)', // Fallback for non-tailwind environments
  };
  
  return { ref, isVisible, className: getAnimationClass(), style: animationStyle };
};
