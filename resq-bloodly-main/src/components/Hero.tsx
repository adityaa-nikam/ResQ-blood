
import React, { useEffect, useRef, useState } from 'react';
import { Search, MapPin, Clock, ArrowRight } from 'lucide-react';
import { useTypingEffect, useScrollAnimation } from '../utils/animation';

const Hero: React.FC = () => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedBloodType, setSelectedBloodType] = useState('');
  const urgentRequestsRef = useRef<HTMLDivElement>(null);
  const { displayText } = useTypingEffect("Save a Life Today! Connect with Blood Donors in Real-Time.", 50);
  const { ref: heroContentRef, isVisible: isContentVisible } = useScrollAnimation(0.1);
  
  const urgentRequests = [
    { bloodType: 'A+', location: 'City Hospital', urgency: 'Critical', timeAgo: '10 mins' },
    { bloodType: 'O-', location: 'Memorial Medical', urgency: 'High', timeAgo: '15 mins' },
    { bloodType: 'B+', location: 'General Hospital', urgency: 'Medium', timeAgo: '30 mins' },
    { bloodType: 'AB+', location: 'Central Clinic', urgency: 'Critical', timeAgo: '5 mins' },
  ];
  
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
  useEffect(() => {
    if (!urgentRequestsRef.current) return;
    
    let startTime: number | null = null;
    let animationFrameId: number;
    
    const animateScroll = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      // Scroll 1px every 50ms (adjustable for speed)
      const scrollAmount = Math.floor(elapsed / 50);
      
      if (urgentRequestsRef.current) {
        // Only scroll if content is longer than container
        if (urgentRequestsRef.current.scrollHeight > urgentRequestsRef.current.clientHeight) {
          urgentRequestsRef.current.scrollTop = scrollAmount % (urgentRequestsRef.current.scrollHeight - urgentRequestsRef.current.clientHeight);
        }
      }
      
      animationFrameId = requestAnimationFrame(animateScroll);
    };
    
    animationFrameId = requestAnimationFrame(animateScroll);
    
    // Pause scrolling on hover
    const handleMouseEnter = () => {
      cancelAnimationFrame(animationFrameId);
    };
    
    const handleMouseLeave = () => {
      startTime = null;
      animationFrameId = requestAnimationFrame(animateScroll);
    };
    
    urgentRequestsRef.current.addEventListener('mouseenter', handleMouseEnter);
    urgentRequestsRef.current.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (urgentRequestsRef.current) {
        urgentRequestsRef.current.removeEventListener('mouseenter', handleMouseEnter);
        urgentRequestsRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);
  
  return (
    <section className="relative min-h-screen pt-24 pb-12 overflow-hidden">
      {/* Background with subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-50/70 to-white dark:from-gray-900 dark:to-black z-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZjAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0aDEydjZoLTEyem0tNiA2aDZWMmgtNnptLTE4LTZoMTJ2NkgxMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30 dark:opacity-10 background-repeat"></div>
      </div>
      
      {/* 3D Blood Drop background elements */}
      <div className="absolute top-1/4 right-10 opacity-20 animate-float" style={{ animationDelay: '0.5s' }}>
        <div className="w-48 h-48 rounded-full bg-red-100 dark:bg-red-900/20 blur-3xl"></div>
      </div>
      <div className="absolute bottom-1/4 left-10 opacity-20 animate-float" style={{ animationDelay: '1s' }}>
        <div className="w-32 h-32 rounded-full bg-red-100 dark:bg-red-900/20 blur-3xl"></div>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between relative z-10">
        <div 
          ref={heroContentRef}
          className="w-full md:w-1/2 mb-10 md:mb-0"
        >
          <div className={`transition-opacity duration-700 ${isContentVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="relative inline-block mb-2 px-4 py-1 rounded-full bg-red-100 dark:bg-red-900/20 text-blood-600 dark:text-blood-400 text-sm font-medium">
              <span className="relative z-10">Blood Donation Platform</span>
              <span className="absolute inset-0 rounded-full bg-red-500/10 animate-pulse"></span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight text-gray-900 dark:text-white">
              <span className="text-gradient">{displayText}</span>
              <span className="inline-block ml-1 animate-pulse">|</span>
            </h1>
            
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-xl">
              Res-Q Blood connects donors with those in need, making blood donation 
              simple, efficient, and life-saving. Join our community today.
            </p>
            
            {/* Search Box */}
            <div 
              className={`relative p-2 rounded-xl transition-all duration-300 mb-8 ${
                searchFocused 
                  ? 'bg-white dark:bg-gray-800 shadow-xl scale-105' 
                  : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg'
              }`}
            >
              <div className="flex flex-col md:flex-row">
                <div className="relative flex-1 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 p-2">
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Blood Type</label>
                  <div className="relative">
                    <select
                      className="w-full bg-transparent text-gray-800 dark:text-gray-200 outline-none appearance-none pr-10"
                      value={selectedBloodType}
                      onChange={(e) => setSelectedBloodType(e.target.value)}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setSearchFocused(false)}
                    >
                      <option value="">Select Blood Type</option>
                      {bloodTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <div className="absolute right-0 top-0 h-full flex items-center pr-2 pointer-events-none">
                      <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <span className="text-xs font-bold text-blood-600 dark:text-blood-400">+</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative flex-1 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 p-2">
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Location</label>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                    <input
                      type="text"
                      placeholder="Enter your location"
                      className="w-full bg-transparent text-gray-800 dark:text-gray-200 outline-none"
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setSearchFocused(false)}
                    />
                  </div>
                </div>
                
                <div className="relative flex-1 p-2">
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Urgency Level</label>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-400 mr-2" />
                    <select
                      className="w-full bg-transparent text-gray-800 dark:text-gray-200 outline-none appearance-none"
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setSearchFocused(false)}
                    >
                      <option value="all">Any Urgency</option>
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
                
                <button className="mt-3 md:mt-0 md:ml-2 px-6 py-4 bg-blood-600 hover:bg-blood-700 text-white rounded-lg flex items-center justify-center transition-colors duration-200 group">
                  <Search className="w-5 h-5 mr-2" />
                  <span>Search</span>
                  <ArrowRight className="w-0 h-5 opacity-0 group-hover:w-5 group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 ease-out" />
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <button className="px-6 py-3 rounded-lg bg-blood-500 text-white hover:bg-blood-600 transition-colors duration-200 flex items-center justify-center shadow-md hover:shadow-lg hover:-translate-y-0.5 transform transition-transform">
                <span>Become a Donor</span>
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              
              <button className="px-6 py-3 rounded-lg border border-blood-500 text-blood-600 dark:text-blood-400 hover:bg-blood-50 dark:hover:bg-blood-900/20 transition-colors duration-200 flex items-center justify-center">
                <span>Request Blood</span>
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-5/12">
          {/* Urgent requests ticker */}
          <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden border border-red-100 dark:border-red-900/20">
            <div className="px-4 py-3 bg-red-100 dark:bg-red-900/30 border-b border-red-200 dark:border-red-800/30 flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse mr-2"></div>
              <h3 className="text-blood-700 dark:text-blood-300 font-medium">Urgent Blood Requests</h3>
            </div>
            
            <div 
              ref={urgentRequestsRef}
              className="h-64 overflow-hidden"
            >
              {urgentRequests.map((request, index) => (
                <div 
                  key={index}
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200 relative ${
                    request.urgency === 'Critical' 
                      ? 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-red-500'
                      : request.urgency === 'High'
                      ? 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-orange-500'
                      : 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-yellow-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3">
                        <span className="text-lg font-bold text-blood-600 dark:text-blood-400">{request.bloodType}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{request.location}</h4>
                        <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>{request.timeAgo} ago</span>
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      request.urgency === 'Critical'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        : request.urgency === 'High'
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    }`}>
                      {request.urgency}
                    </div>
                  </div>
                  
                  <div className="mt-3 flex justify-end">
                    <button className="px-3 py-1 text-sm text-blood-600 dark:text-blood-400 hover:text-blood-700 dark:hover:text-blood-300 transition-colors duration-200">
                      Respond Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white dark:from-gray-800 to-transparent pointer-events-none"></div>
          </div>
          
          {/* Heartbeat animation */}
          <div className="absolute bottom-0 right-0 w-full h-2 overflow-hidden">
            <div className="heartbeat-line w-full h-full flex items-center">
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-blood-500/50 to-transparent relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blood-500/30 animate-ping"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
