
import React, { useState, useEffect, useRef } from 'react';

interface CustomCursorProps {
  color?: string;
  size?: number;
  rippleSize?: number;
  trailColor?: string;
}

const CustomCursor: React.FC<CustomCursorProps> = ({
  color = 'rgba(255, 255, 255, 0.8)',
  size = 24,
  rippleSize = 50,
  trailColor = 'rgba(255, 255, 255, 0.2)'
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  
  // Handle cursor movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
      
      // Check if hovering over a clickable element
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.tagName === 'INPUT' ||
        !!target.closest('button') || 
        !!target.closest('a') ||
        !!target.closest('[role="button"]') ||
        window.getComputedStyle(target).cursor === 'pointer';
      
      setIsPointer(isClickable);
    };
    
    const handleMouseDown = () => {
      setIsActive(true);
    };
    
    const handleMouseUp = () => {
      setIsActive(false);
    };
    
    const handleMouseLeave = () => {
      setIsVisible(false);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  
  // Update cursor and trail position with smooth animation
  useEffect(() => {
    if (cursorRef.current && trailRef.current && rippleRef.current) {
      // Main cursor follows the mouse directly
      cursorRef.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
      
      // Trail follows with a slight delay
      trailRef.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
      
      // Ripple follows the mouse directly
      rippleRef.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
    }
  }, [position]);
  
  return (
    <>
      {/* Hide the default cursor */}
      <style>
        {`
        body {
          cursor: none;
        }
        
        @media (max-width: 768px) {
          body {
            cursor: auto;
          }
        }
        
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }
        
        .cursor-ripple:active::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          transform: translate(-50%, -50%) scale(0);
          background: ${color};
          border-radius: 50%;
          opacity: 0;
          animation: ripple 0.6s ease-out;
        }
      `}
      </style>
      
      {/* Main cursor dot */}
      <div
        ref={cursorRef}
        className={`fixed pointer-events-none z-[9999] flex items-center justify-center transition-transform duration-100 ease-out ${
          !isVisible ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          left: -size / 2,
          top: -size / 2,
          width: isPointer ? size * 1.5 : size,
          height: isPointer ? size * 1.5 : size,
          backgroundColor: isActive ? 'rgba(220, 38, 38, 0.9)' : color,
          borderRadius: '50%',
          mixBlendMode: 'difference',
          transition: 'width 0.3s, height 0.3s, background-color 0.3s',
          willChange: 'transform',
        }}
      />
      
      {/* Cursor trail */}
      <div
        ref={trailRef}
        className={`fixed pointer-events-none z-[9998] ${
          !isVisible ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          left: -size * 1.5,
          top: -size * 1.5,
          width: size * 3,
          height: size * 3,
          backgroundColor: 'transparent',
          border: `1px solid ${trailColor}`,
          borderRadius: '50%',
          mixBlendMode: 'difference',
          transition: 'transform 0.3s ease-out',
          willChange: 'transform',
        }}
      />
      
      {/* Ripple effect on click */}
      <div
        ref={rippleRef}
        className={`fixed pointer-events-none z-[9997] cursor-ripple ${
          !isVisible ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          left: -rippleSize / 2,
          top: -rippleSize / 2,
          width: rippleSize,
          height: rippleSize,
          backgroundColor: 'transparent',
          borderRadius: '50%',
          willChange: 'transform',
        }}
      />
    </>
  );
};

export default CustomCursor;
