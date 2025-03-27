
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { BloodCompatibility, BLOOD_COMPATIBILITY, BloodType } from '@/types/blood';
import { User } from '@/contexts/AuthContext';
import { getBloodRequests } from '@/data/bloodRequests';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const INITIAL_BOT_MESSAGE: Message = {
  id: 'welcome',
  content: "👋 Hello! I'm the Res-Q Blood Assistant. I can help with blood donation information, finding donors, or answering questions about blood compatibility. How can I assist you today?",
  sender: 'bot',
  timestamp: new Date()
};

const SUGGESTIONS = [
  "What blood type can I donate to?",
  "Find donors near me",
  "How often can I donate blood?",
  "What are the requirements to donate?",
  "Check blood compatibility"
];

const AIBloodChatbot: React.FC<{ user?: User | null }> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_BOT_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of chat whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const simulateTyping = (response: string) => {
    setIsTyping(true);
    
    // Calculate a natural typing delay based on message length (50-100 chars per second)
    const typingSpeed = Math.max(1000, Math.min(response.length * 20, 3000));
    
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: response,
        sender: 'bot',
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, typingSpeed);
  };
  
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Process the message to generate a response
    processUserMessage(inputValue);
  };
  
  const processUserMessage = (message: string) => {
    const normalizedMessage = message.toLowerCase();
    
    // Check for blood type compatibility questions
    const bloodTypeMatch = normalizedMessage.match(/(a|b|ab|o)(\+|\-)/i);
    if (
      bloodTypeMatch || 
      normalizedMessage.includes('blood type') || 
      normalizedMessage.includes('compatibility')
    ) {
      handleBloodTypeQuestion(normalizedMessage, bloodTypeMatch?.[0] as BloodType);
      return;
    }
    
    // Check for donation requirements
    if (
      normalizedMessage.includes('requirement') || 
      normalizedMessage.includes('how can i donate') ||
      normalizedMessage.includes('eligible')
    ) {
      handleDonationRequirements();
      return;
    }
    
    // Check for donor search
    if (
      normalizedMessage.includes('find donor') || 
      normalizedMessage.includes('need blood') ||
      normalizedMessage.includes('near me')
    ) {
      handleDonorSearch();
      return;
    }
    
    // Check for donation frequency
    if (
      normalizedMessage.includes('how often') || 
      normalizedMessage.includes('frequency')
    ) {
      handleDonationFrequency();
      return;
    }
    
    // Default response for unrecognized queries
    simulateTyping(
      "I'm not sure I understand your question. You can ask me about blood compatibility, donation requirements, finding donors, or how often you can donate. Would you like information on any of these topics?"
    );
  };
  
  const handleDonationFrequency = () => {
    simulateTyping(
      "Whole blood donations can typically be made every 56 days (8 weeks). Plasma donations can be made more frequently, about every 28 days. Platelet donations can be made every 7 days, up to 24 times per year. These timeframes allow your body to replenish the donated components. Always check with your specific blood donation center as their guidelines may vary slightly."
    );
  };
  
  const handleDonationRequirements = () => {
    simulateTyping(
      "To donate blood, you typically need to:\n\n" + 
      "• Be at least 16-17 years old (varies by location)\n" + 
      "• Weigh at least 110 pounds (50 kg)\n" + 
      "• Be in good general health\n" + 
      "• Have normal blood pressure and pulse\n" + 
      "• Pass a brief physical examination\n" + 
      "• Not have donated blood in the last 8 weeks\n\n" + 
      "Some medications, travel history, or medical conditions may affect eligibility. Would you like me to check if you're eligible based on specific criteria?"
    );
  };
  
  const handleBloodTypeQuestion = (message: string, detectedBloodType?: BloodType) => {
    // If user has a blood type in their profile, use that
    const userBloodType = user?.bloodType as BloodType | undefined;
    const bloodType = detectedBloodType || userBloodType;
    
    if (!bloodType && (message.includes('my blood type') || message.includes('i donate'))) {
      if (user) {
        simulateTyping(
          "I don't see your blood type in your profile. If you know your blood type, you can update your profile, and I can provide compatibility information."
        );
      } else {
        simulateTyping(
          "To get information about your specific blood type compatibility, please log in and add your blood type to your profile, or simply tell me your blood type."
        );
      }
      return;
    }
    
    if (bloodType && BLOOD_COMPATIBILITY[bloodType]) {
      const compatibility = BLOOD_COMPATIBILITY[bloodType];
      simulateTyping(
        `For blood type ${bloodType}:\n\n` +
        `• You can donate to: ${compatibility.canDonateTo.join(', ')}\n` +
        `• You can receive from: ${compatibility.canReceiveFrom.join(', ')}\n\n` +
        `${bloodType === 'O-' ? "You're a universal donor! Your blood can be given to anyone." : ""}` +
        `${bloodType === 'AB+' ? "You're a universal recipient! You can receive blood from any type." : ""}`
      );
    } else {
      simulateTyping(
        "Let me tell you about blood type compatibility:\n\n" +
        "• Type O- is the universal donor (can donate to all blood types)\n" +
        "• Type AB+ is the universal recipient (can receive from all blood types)\n" +
        "• Type A can donate to A and AB\n" +
        "• Type B can donate to B and AB\n" +
        "• Type AB can only donate to AB\n\n" +
        "If you'd like specific information, please tell me your blood type."
      );
    }
  };
  
  const handleDonorSearch = () => {
    if (user) {
      const urgentRequests = getBloodRequests({ status: 'pending', limit: 3 });
      
      if (urgentRequests.length > 0) {
        let response = "Here are some current urgent blood requests:\n\n";
        
        urgentRequests.forEach((request, index) => {
          response += `${index + 1}. Request for ${request.bloodType} (${request.units} units)\n` +
                      `   Location: ${request.location.address}\n` +
                      `   Urgency: ${request.urgency}\n` +
                      `   Hospital: ${request.hospitalName}\n\n`;
        });
        
        response += "Would you like to see details for any of these requests or search with specific criteria?";
        simulateTyping(response);
      } else {
        simulateTyping(
          "I don't see any urgent blood requests at the moment. Would you like to create a new request or check again later?"
        );
      }
    } else {
      simulateTyping(
        "To search for blood donors or view blood requests, please log in first. This helps us match you with appropriate donors in your area."
      );
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: suggestion,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Process the suggestion
    processUserMessage(suggestion);
  };
  
  return (
    <>
      {/* Chat bubble button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 rounded-full",
          "bg-blood-600 text-white shadow-lg transform transition-all duration-300",
          "hover:bg-blood-700 focus:outline-none focus:ring-2 focus:ring-blood-400",
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100",
        )}
        aria-label="Open chat"
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
        </svg>
      </button>
      
      {/* Chatbot interface */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 w-96 max-h-[70vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl",
          "flex flex-col transform transition-all duration-500 ease-in-out",
          "backdrop-blur-lg bg-white/90 dark:bg-gray-800/90 border border-gray-100 dark:border-gray-700",
          isOpen ? "scale-100 opacity-100" : "scale-90 opacity-0 pointer-events-none"
        )}
      >
        {/* Chat header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-blood-500 to-blood-600">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Res-Q Blood Assistant</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Online | AI-powered</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Messages container */}
        <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "mb-4 max-w-[80%] animate-slideUp",
                message.sender === 'user' ? "ml-auto" : "mr-auto"
              )}
            >
              <div
                className={cn(
                  "p-3 rounded-xl shadow-sm",
                  message.sender === 'user' 
                    ? "bg-blood-600 text-white rounded-tr-none"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none"
                )}
              >
                <p className="whitespace-pre-line">{message.content}</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ))}
          
          {isTyping && (
            <div className="mb-4 max-w-[80%] mr-auto">
              <div className="p-3 rounded-xl shadow-sm bg-gray-100 dark:bg-gray-700 rounded-tl-none flex items-center">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Suggestions */}
        {messages.length <= 2 && (
          <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Input area */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 p-2 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blood-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className={cn(
                "p-2 rounded-full",
                inputValue.trim()
                  ? "bg-blood-600 text-white hover:bg-blood-700" 
                  : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              )}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIBloodChatbot;
