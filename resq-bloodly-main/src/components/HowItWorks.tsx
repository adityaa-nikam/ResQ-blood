
import React from 'react';
import { ClipboardCheck, Search, Heart, ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '../utils/animation';

const HowItWorks: React.FC = () => {
  const { ref: sectionRef, isVisible: isSectionVisible } = useScrollAnimation(0.1);
  const { ref: step1Ref, isVisible: isStep1Visible } = useScrollAnimation(0.3);
  const { ref: step2Ref, isVisible: isStep2Visible } = useScrollAnimation(0.3);
  const { ref: step3Ref, isVisible: isStep3Visible } = useScrollAnimation(0.3);
  
  return (
    <section 
      id="how-it-works" 
      ref={sectionRef}
      className={`py-20 relative overflow-hidden transition-opacity duration-700 ${
        isSectionVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-50/50 to-white/50 dark:from-gray-900/50 dark:to-black/50 z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/20 text-blood-600 dark:text-blood-400 text-sm font-medium mb-3">
            How It Works
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Three Simple Steps to Save Lives
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Our platform simplifies the blood donation process, connecting donors 
            and recipients efficiently and securely.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/3 left-0 right-0 h-0.5 bg-gradient-to-r from-blood-200 via-blood-300 to-blood-200 dark:from-blood-900/30 dark:via-blood-800/30 dark:to-blood-900/30 z-0"></div>
          
          {/* Step 1 */}
          <div 
            ref={step1Ref}
            className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-all duration-700 hover:shadow-xl transform hover:-translate-y-1 ${
              isStep1Visible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-blood-100 dark:bg-blood-900/30 flex items-center justify-center border-4 border-white dark:border-gray-800 z-10">
              <span className="text-blood-600 dark:text-blood-400 font-semibold">1</span>
            </div>
            <div className="h-20 w-20 mx-auto mb-6 relative">
              <div className="absolute inset-0 rounded-full bg-red-100 dark:bg-red-900/20 animate-pulse opacity-50"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <ClipboardCheck className="h-10 w-10 text-blood-500" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center text-gray-900 dark:text-white">
              Request Blood
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
              Enter your blood type, location, and urgency level to create a blood request instantly.
            </p>
            <div className="flex justify-center">
              <button className="text-blood-500 hover:text-blood-700 dark:text-blood-400 dark:hover:text-blood-300 font-medium flex items-center">
                Learn More
                <ArrowRight className="ml-1 w-4 h-4" />
              </button>
            </div>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-white dark:border-t-gray-800 hidden md:block"></div>
          </div>
          
          {/* Step 2 */}
          <div 
            ref={step2Ref}
            className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-all duration-700 hover:shadow-xl transform hover:-translate-y-1 ${
              isStep2Visible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-blood-100 dark:bg-blood-900/30 flex items-center justify-center border-4 border-white dark:border-gray-800 z-10">
              <span className="text-blood-600 dark:text-blood-400 font-semibold">2</span>
            </div>
            <div className="h-20 w-20 mx-auto mb-6 relative">
              <div className="absolute inset-0 rounded-full bg-red-100 dark:bg-red-900/20 opacity-50"></div>
              <div className="absolute inset-1 rounded-full bg-red-100 dark:bg-red-900/30 animate-ping opacity-50"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Search className="h-10 w-10 text-blood-500" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center text-gray-900 dark:text-white">
              Find Donors
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
              Our system instantly matches your request with nearby donors based on blood type and location.
            </p>
            <div className="flex justify-center">
              <button className="text-blood-500 hover:text-blood-700 dark:text-blood-400 dark:hover:text-blood-300 font-medium flex items-center">
                Learn More
                <ArrowRight className="ml-1 w-4 h-4" />
              </button>
            </div>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-white dark:border-t-gray-800 hidden md:block"></div>
          </div>
          
          {/* Step 3 */}
          <div 
            ref={step3Ref}
            className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-all duration-700 hover:shadow-xl transform hover:-translate-y-1 ${
              isStep3Visible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-blood-100 dark:bg-blood-900/30 flex items-center justify-center border-4 border-white dark:border-gray-800 z-10">
              <span className="text-blood-600 dark:text-blood-400 font-semibold">3</span>
            </div>
            <div className="h-20 w-20 mx-auto mb-6 relative">
              <div className="absolute inset-0 rounded-full bg-red-100 dark:bg-red-900/20 opacity-50"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Heart className="h-10 w-10 text-blood-500 animate-heartbeat" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center text-gray-900 dark:text-white">
              Save a Life
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
              Connect with donors, coordinate the donation, and help save a precious life.
            </p>
            <div className="flex justify-center">
              <button className="text-blood-500 hover:text-blood-700 dark:text-blood-400 dark:hover:text-blood-300 font-medium flex items-center">
                Learn More
                <ArrowRight className="ml-1 w-4 h-4" />
              </button>
            </div>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-white dark:border-t-gray-800 hidden md:block"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
