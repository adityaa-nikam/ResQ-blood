
import React from 'react';
import { Users, Award, Heart, BarChart } from 'lucide-react';
import { useCountUp, useScrollAnimation } from '../utils/animation';

const StatsSection: React.FC = () => {
  const { ref: sectionRef, isVisible: isSectionVisible } = useScrollAnimation(0.1);
  const { count: donorsCount, ref: donorsRef } = useCountUp(5840, 2000);
  const { count: donationsCount, ref: donationsRef } = useCountUp(12500, 2000, 300);
  const { count: livesSavedCount, ref: livesSavedRef } = useCountUp(8350, 2000, 600);
  const { count: hospitalsCount, ref: hospitalsRef } = useCountUp(320, 2000, 900);
  
  const stats = [
    { 
      id: 'donors',
      ref: donorsRef,
      icon: <Users className="h-7 w-7 text-blood-500" />,
      value: donorsCount,
      label: 'Registered Donors',
      suffix: '+',
      description: 'Blood donors across the country ready to help',
    },
    { 
      id: 'donations',
      ref: donationsRef,
      icon: <Award className="h-7 w-7 text-blood-500" />,
      value: donationsCount,
      label: 'Blood Donations',
      suffix: '+',
      description: 'Successful blood donations through our platform',
    },
    { 
      id: 'lives',
      ref: livesSavedRef,
      icon: <Heart className="h-7 w-7 text-blood-500 animate-heartbeat" />,
      value: livesSavedCount,
      label: 'Lives Saved',
      suffix: '+',
      description: 'People helped through the gift of blood donation',
    },
    { 
      id: 'hospitals',
      ref: hospitalsRef,
      icon: <BarChart className="h-7 w-7 text-blood-500" />,
      value: hospitalsCount,
      label: 'Hospital Partners',
      suffix: '+',
      description: 'Healthcare facilities using our platform',
    },
  ];
  
  return (
    <section 
      ref={sectionRef}
      className={`py-20 relative overflow-hidden transition-opacity duration-700 ${
        isSectionVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Background with pattern */}
      <div className="absolute inset-0 bg-white dark:bg-gray-900 opacity-95 z-0"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZjAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0aDEydjZoLTEyem0tNiA2aDZWMmgtNnptLTE4LTZoMTJ2NkgxMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30 dark:opacity-10 background-repeat z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/20 text-blood-600 dark:text-blood-400 text-sm font-medium mb-3">
            Our Impact
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Making a Difference Together
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Every donation counts. See how our community is creating a positive impact 
            and saving lives across the nation.
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6">
          {stats.map((stat) => (
            <div 
              key={stat.id}
              ref={stat.ref}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mr-4">
                  {stat.icon}
                </div>
                <div>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.value.toLocaleString()}
                    </span>
                    <span className="ml-1 text-xl text-blood-500 font-semibold">
                      {stat.suffix}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </h3>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* Success Stories */}
        <div className="mt-16 relative overflow-hidden">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Success Stories
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Real stories from people who have been helped through blood donation
            </p>
          </div>
          
          <div className="flex overflow-x-hidden">
            <div className="flex animate-[scrollX_30s_linear_infinite]">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4 px-4">
                  {[...Array(3)].map((_, j) => {
                    const idx = i * 3 + j;
                    return (
                      <div 
                        key={`story-${idx}`}
                        className="w-80 shrink-0 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl"
                      >
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blood-400 to-blood-600 flex items-center justify-center text-white font-bold text-lg">
                            {['JD', 'SK', 'MC', 'RN', 'BP', 'LK', 'AT', 'SP', 'HR'][idx % 9]}
                          </div>
                          <div className="ml-3">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {['John D.', 'Sarah K.', 'Mike C.', 'Rita N.', 'Ben P.', 'Lisa K.', 'Alex T.', 'Sam P.', 'Helen R.'][idx % 9]}
                            </h4>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {['Recipient', 'Donor', 'Recipient', 'Donor', 'Recipient', 'Donor', 'Recipient', 'Donor', 'Recipient'][idx % 9]}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                          {[
                            "A blood donor saved my life after my accident. I'm forever grateful for their selfless gift.",
                            "Donating regularly makes me feel connected to my community. It's simple but impactful.",
                            "I needed rare blood for surgery. Thanks to this platform, I found donors quickly.",
                            "My regular donations have helped numerous patients. The process is quick and rewarding.",
                            "When my daughter needed emergency transfusions, donors appeared within hours.",
                            "I've donated 20+ times. Each time, I remember that my blood helps someone in need.",
                            "My cancer treatment required blood. Strangers ensured I had what I needed to survive.",
                            "Donating blood costs nothing but time, yet gives someone the gift of life.",
                            "After childbirth complications, I needed blood urgently. Donors saved me and my baby."
                          ][idx % 9]}
                        </p>
                        <div className="flex">
                          {[...Array(5)].map((_, k) => (
                            <svg 
                              key={k} 
                              className="w-4 h-4 text-yellow-400" 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          
          <div className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-white to-transparent dark:from-gray-900 dark:to-transparent pointer-events-none z-10"></div>
          <div className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-l from-white to-transparent dark:from-gray-900 dark:to-transparent pointer-events-none z-10"></div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
