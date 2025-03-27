
import React, { useRef, useEffect } from 'react';

interface BloodDropLogoProps {
  size?: number;
  className?: string;
  pulseEffect?: boolean;
}

const BloodDropLogo: React.FC<BloodDropLogoProps> = ({ 
  size = 40, 
  className = "",
  pulseEffect = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions with higher resolution for retina displays
    const scale = window.devicePixelRatio || 1;
    canvas.width = size * scale;
    canvas.height = size * scale;
    
    // Scale the context to ensure correct dimensions
    ctx.scale(scale, scale);
    
    // Set canvas CSS dimensions
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    
    let angle = 0;
    let floatOffset = 0;
    
    const drawBloodDrop = (time: number) => {
      ctx.clearRect(0, 0, size, size);
      
      // Calculate animation values
      angle = time * 0.001;
      const pulseFactor = pulseEffect ? Math.sin(angle * 2) * 0.05 + 0.95 : 1;
      
      // Float animation
      floatOffset = Math.sin(angle * 0.5) * 2;
      
      // 3D-like shadow effect
      ctx.shadowColor = 'rgba(150, 0, 0, 0.6)';
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 5;
      
      // Blood drop shape
      ctx.beginPath();
      const centerX = size / 2;
      const centerY = size / 2 + floatOffset;
      const dropWidth = size * 0.5 * pulseFactor;
      const dropHeight = size * 0.7 * pulseFactor;
      
      // Create teardrop shape with better path
      ctx.moveTo(centerX, centerY - dropHeight / 2);
      ctx.bezierCurveTo(
        centerX + dropWidth / 2, centerY - dropHeight / 4,
        centerX + dropWidth / 2, centerY + dropHeight / 4,
        centerX, centerY + dropHeight / 2
      );
      ctx.bezierCurveTo(
        centerX - dropWidth / 2, centerY + dropHeight / 4,
        centerX - dropWidth / 2, centerY - dropHeight / 4,
        centerX, centerY - dropHeight / 2
      );
      
      // Create enhanced glossy blood drop effect with more realistic gradient
      const gradient = ctx.createRadialGradient(
        centerX - dropWidth * 0.2, centerY - dropHeight * 0.2, 0,
        centerX, centerY, dropWidth
      );
      
      // More realistic blood color with multiple stops
      gradient.addColorStop(0, '#ff6666');
      gradient.addColorStop(0.3, '#ff3333');
      gradient.addColorStop(0.5, '#e60000');
      gradient.addColorStop(0.8, '#b30000');
      gradient.addColorStop(1, '#800000');
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Add enhanced shine effect
      ctx.beginPath();
      ctx.ellipse(
        centerX - dropWidth * 0.15,
        centerY - dropHeight * 0.2,
        dropWidth * 0.15,
        dropHeight * 0.1,
        Math.PI / 4,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.shadowColor = 'transparent';
      ctx.fill();
      
      // Add second highlight for more realistic look
      ctx.beginPath();
      ctx.ellipse(
        centerX - dropWidth * 0.05,
        centerY - dropHeight * 0.05,
        dropWidth * 0.08,
        dropHeight * 0.05,
        Math.PI / 3,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fill();
      
      // Add animated ripple effect at the bottom
      const rippleTime = time * 0.002;
      const rippleSize = (Math.sin(rippleTime) * 0.5 + 0.5) * (size * 0.15);
      const rippleOpacity = Math.sin(rippleTime) * 0.3 + 0.2;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY + dropHeight * 0.45, rippleSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 0, 0, ${rippleOpacity})`;
      ctx.fill();
      
      // Add heartbeat line with enhanced animation
      if (pulseEffect) {
        ctx.beginPath();
        const lineWidth = size * 0.6;
        const lineY = centerY + dropHeight * 0.1;
        const pulseHeight = size * 0.08 * pulseFactor * (Math.sin(angle * 4) * 0.3 + 0.7);
        
        ctx.moveTo(centerX - lineWidth / 2, lineY);
        ctx.lineTo(centerX - lineWidth / 4, lineY);
        ctx.lineTo(centerX - lineWidth / 6, lineY - pulseHeight);
        ctx.lineTo(centerX, lineY + pulseHeight);
        ctx.lineTo(centerX + lineWidth / 6, lineY - pulseHeight * 1.2);
        ctx.lineTo(centerX + lineWidth / 4, lineY);
        ctx.lineTo(centerX + lineWidth / 2, lineY);
        
        // Create glowing heartbeat line
        ctx.strokeStyle = 'rgba(255, 50, 50, 0.9)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Add glow to the heartbeat line
        ctx.shadowColor = 'rgba(255, 0, 0, 0.8)';
        ctx.shadowBlur = 5;
        ctx.strokeStyle = 'rgba(255, 200, 200, 0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      
      requestAnimationFrame(drawBloodDrop);
    };
    
    const animationId = requestAnimationFrame(drawBloodDrop);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [size, pulseEffect]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className={`blood-drop-3d ${className}`} 
      style={{ width: size, height: size }}
    />
  );
};

export default BloodDropLogo;
