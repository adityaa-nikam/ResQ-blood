
import React, { useEffect } from 'react';
import { useLocation, Link } from "react-router-dom";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useScrollAnimation } from '../utils/animationUtils';
import { RotateCcw, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  const location = useLocation();
  const { ref: contentRef, isVisible: isContentVisible, animationStyle } = useScrollAnimation({
    threshold: 0.1,
    animation: 'fade-in',
    duration: 800
  });

  useEffect(() => {
    // Set dark mode by default
    document.documentElement.classList.add('dark');
    
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center px-4 py-20">
        <div 
          ref={contentRef as React.RefObject<HTMLDivElement>}
          style={animationStyle as React.CSSProperties}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="relative mb-8 inline-block">
            <div className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blood-500 to-blood-700 dark:from-blood-400 dark:to-blood-600">
              404
            </div>
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
            Page Not Found
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto">
            The page you're looking for doesn't exist or has been moved to another location.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="px-6 py-3 rounded-full bg-blood-500 text-white hover:bg-blood-600 transition-colors duration-200 flex items-center gap-2 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 rounded-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 flex items-center gap-2 group"
            >
              <RotateCcw className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              Go Back
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NotFound;
