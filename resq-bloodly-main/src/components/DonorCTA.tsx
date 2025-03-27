
import React, { useState } from 'react';
import { Heart, ArrowRight, Award, Shield } from 'lucide-react';
import { useScrollAnimation } from '../utils/animation';

const DonorCTA: React.FC = () => {
  const { ref: sectionRef, isVisible: isSectionVisible } = useScrollAnimation(0.1);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  
  const donorFeatures = [
    {
      icon: <Heart className="h-8 w-8 text-white" />,
      title: 'Save Lives',
      description: 'A single donation can help save multiple lives in emergency situations.'
    },
    {
      icon: <Award className="h-8 w-8 text-white" />,
      title: 'Earn Rewards',
      description: 'Get recognition and rewards for your life-saving contributions.'
    },
    {
      icon: <Shield className="h-8 w-8 text-white" />,
      title: 'Safe & Secure',
      description: 'Your health and personal information are protected with the highest standards.'
    },
  ];
  
  return (
    <section 
      ref={sectionRef}
      className={`py-20 relative overflow-hidden transition-opacity duration-700 ${
        isSectionVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Enhanced background with animated elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blood-700/90 to-blood-900/90 z-0"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aDEydjZoLTEyem0tNiA2aDZWMmgtNnptLTE4LTZoMTJ2NkgxMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20 bg-repeat z-0"></div>
      
      {/* Animated background particles */}
      <div className="cyber-bg absolute inset-0 opacity-20 z-0"></div>
      
      {/* Floating elements with enhanced animations */}
      <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white/10 blur-xl animate-float"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-white/10 blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-10 h-10 rounded-full bg-white/20 blur-md animate-tilt-bounce" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-white/10 blur-xl animate-float" style={{ animationDelay: '1.5s' }}></div>
      
      {/* Spotlight effect */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full">
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-blood-500/10 blur-[100px] opacity-30"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white neon-text">
              Join as a Donor & Become a Lifesaver
            </h2>
            <p className="text-lg text-white/90 max-w-3xl mx-auto">
              Your blood donation can save up to three lives. Join our community of donors 
              and make a difference in someone's life today.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {donorFeatures.map((item, index) => (
              <div 
                key={index}
                className="card-container"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div 
                  className={`card-inner ${hoveredCard === index ? 'transform rotate-y-180' : ''}`}
                >
                  {/* Card Front */}
                  <div className="card-front glass-panel rounded-xl p-6 border border-white/20 transition-all duration-300 h-full">
                    <div className="w-16 h-16 rounded-full bg-blood-600/40 flex items-center justify-center mb-5 mx-auto neon-border">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-white text-center">
                      {item.title}
                    </h3>
                    <p className="text-white/80 text-center">
                      {item.description}
                    </p>
                  </div>
                  
                  {/* Card Back */}
                  <div className="card-back glass-panel rounded-xl p-6 border border-white/20 bg-blood-900/60 h-full flex flex-col justify-center items-center">
                    <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4 animate-pulse">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white neon-text">
                      {item.title}
                    </h3>
                    <button className="mt-4 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors duration-200 flex items-center">
                      Learn More
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center">
            <button className="px-8 py-4 rounded-full bg-white text-blood-600 hover:bg-white/90 transition-colors duration-200 flex items-center justify-center font-medium text-lg shadow-xl hover:shadow-2xl shadow-blood-800/20 hover:shadow-blood-800/30 hover:-translate-y-1 transform transition-transform group relative overflow-hidden">
              <span className="relative z-10">Register as a Donor</span>
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200 relative z-10" />
              
              {/* Button ripple effect */}
              <span className="absolute inset-0 w-full h-full bg-white rounded-full transition-transform duration-500 transform scale-0 group-hover:scale-100 origin-center"></span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blood-500 to-blood-600 rounded-full transition-opacity duration-500 opacity-0 group-hover:opacity-20"></span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Enhanced decorative wave at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" fill="rgb(15, 19, 25)" className="w-full h-auto">
          <path d="M0,96L80,85.3C160,75,320,53,480,53.3C640,53,800,75,960,74.7C1120,75,1280,53,1360,42.7L1440,32L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default DonorCTA;
