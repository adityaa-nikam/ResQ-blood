
import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import Stats from '../components/Stats';
import DonorCTA from '../components/DonorCTA';
import Footer from '../components/Footer';
import AnimatedBackground from '../components/AnimatedBackground';
import AIBloodChatbot from '../components/AIBloodChatbot';
import { useAuth } from '../contexts/AuthContext';
import { initializeDemoData } from '../services/backendService';
import { toast } from '../components/ui/use-toast';

const Index: React.FC = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    // Set dark mode by default
    document.documentElement.classList.add('dark');
    
    // Scroll to top on component mount
    window.scrollTo(0, 0);
    
    // Initialize backend service with demo data
    initializeDemoData();
    
    // Welcome toast message
    setTimeout(() => {
      toast({
        title: "Welcome to Res-Q Blood",
        description: "The fastest way to find blood donors and save lives.",
        variant: "default",
      });
    }, 1500);
    
    // Add scroll animation classes
    const handleScroll = () => {
      const sections = document.querySelectorAll('.animate-on-scroll');
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const isInView = rect.top <= window.innerHeight * 0.75;
        
        if (isInView) {
          section.classList.add('is-visible');
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background dark:bg-dark-gradient relative overflow-hidden">
      {/* Animated background with particles and 3D elements */}
      <AnimatedBackground />
      
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <HowItWorks />
        <Stats />
        <DonorCTA />
        <Footer />
      </div>
      
      {/* AI Chatbot */}
      <AIBloodChatbot user={user} />
      
      {/* Global animation styles */}
      <style>
        {`
          @keyframes float-up {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes fade-in-scale {
            0% { opacity: 0; transform: scale(0.9); }
            100% { opacity: 1; transform: scale(1); }
          }
          
          @keyframes slide-in-right {
            0% { opacity: 0; transform: translateX(30px); }
            100% { opacity: 1; transform: translateX(0); }
          }
          
          @keyframes slide-in-left {
            0% { opacity: 0; transform: translateX(-30px); }
            100% { opacity: 1; transform: translateX(0); }
          }
          
          .animate-on-scroll {
            opacity: 0;
            transition: opacity 0.8s ease, transform 0.8s ease;
          }
          
          .animate-on-scroll.is-visible {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          
          .animate-float-up {
            animation: float-up 0.8s ease-out forwards;
          }
          
          .animate-delay-100 { animation-delay: 100ms; }
          .animate-delay-200 { animation-delay: 200ms; }
          .animate-delay-300 { animation-delay: 300ms; }
          .animate-delay-400 { animation-delay: 400ms; }
          .animate-delay-500 { animation-delay: 500ms; }
          
          .animated-link {
            position: relative;
          }
          
          .animated-link::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: -2px;
            left: 0;
            background-color: #ef4444;
            transition: width 0.3s ease-out;
          }
          
          .animated-link:hover::after {
            width: 100%;
          }
          
          @keyframes heartbeat {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.15); }
          }
          
          .animate-heartbeat {
            animation: heartbeat 1.5s ease-in-out infinite;
          }
          
          @keyframes drop-float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          
          .animate-drop-float {
            animation: drop-float 2s ease-in-out infinite;
          }
          
          @keyframes scrollX {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>
    </div>
  );
};

export default Index;
