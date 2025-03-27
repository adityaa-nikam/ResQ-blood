
import React, { useEffect, useRef } from 'react';

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to full screen
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Blood particle system
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;
      pulseSpeed: number;
      pulseDirection: number;
      currentPulse: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        
        // Create a blood red color with varying shades
        const r = 180 + Math.floor(Math.random() * 75);
        const g = Math.floor(Math.random() * 30);
        const b = Math.floor(Math.random() * 30);
        this.color = `rgba(${r}, ${g}, ${b}`;
        
        this.alpha = Math.random() * 0.6 + 0.1;
        
        // Pulsing effect
        this.pulseSpeed = Math.random() * 0.01 + 0.005;
        this.pulseDirection = 1;
        this.currentPulse = Math.random();
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Boundary check with wrapping
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
        
        // Pulsing alpha effect
        this.currentPulse += this.pulseSpeed * this.pulseDirection;
        if (this.currentPulse >= 1 || this.currentPulse <= 0) {
          this.pulseDirection *= -1;
        }
        
        const pulseFactor = Math.sin(this.currentPulse * Math.PI);
        const currentAlpha = this.alpha * pulseFactor;
        
        return currentAlpha;
      }

      draw(alpha: number) {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color}, ${alpha})`;
        ctx.fill();
      }
    }

    // Create particles
    const particleCount = Math.min(Math.floor(window.innerWidth * window.innerHeight / 15000), 100);
    const particles: Particle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Draw network connections between nearby particles
    const drawConnections = () => {
      if (!ctx) return;
      
      const maxDistance = 150;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            const opacity = 1 - (distance / maxDistance);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(200, 0, 0, ${opacity * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    // Create spotlight effects
    class Spotlight {
      x: number;
      y: number;
      size: number;
      alpha: number;
      speed: number;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 300 + 100;
        this.alpha = Math.random() * 0.2 + 0.05;
        this.speed = Math.random() * 0.5 + 0.1;
      }
      
      update() {
        this.y -= this.speed;
        
        if (this.y + this.size < 0) {
          this.y = canvas.height + this.size;
          this.x = Math.random() * canvas.width;
        }
      }
      
      draw() {
        if (!ctx) return;
        
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        
        gradient.addColorStop(0, `rgba(200, 0, 0, ${this.alpha})`);
        gradient.addColorStop(1, 'rgba(200, 0, 0, 0)');
        
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Create spotlights
    const spotlightCount = 5;
    const spotlights: Spotlight[] = [];
    
    for (let i = 0; i < spotlightCount; i++) {
      spotlights.push(new Spotlight());
    }

    // Animation loop
    const animate = () => {
      if (!ctx) return;
      
      // Clear canvas with a subtle fade effect instead of completely clearing
      ctx.fillStyle = 'rgba(15, 19, 25, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw and update spotlights
      spotlights.forEach(spotlight => {
        spotlight.update();
        spotlight.draw();
      });
      
      // Draw and update particles
      particles.forEach(particle => {
        const alpha = particle.update();
        particle.draw(alpha);
      });
      
      // Draw connections
      drawConnections();
      
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default AnimatedBackground;
