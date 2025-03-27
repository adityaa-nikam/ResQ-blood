
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import BloodDropLogo from './BloodDropLogo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 pt-16 pb-6 relative z-10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-8 mb-12">
          {/* Logo & About */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center gap-2 group">
              <BloodDropLogo size={32} className="group-hover:animate-drop-float" />
              <div className="flex flex-col">
                <span className="font-bold text-lg text-blood-600 dark:text-blood-500 tracking-tight">
                  Res-Q Blood
                </span>
                <span className="text-xs text-blood-500/70 dark:text-blood-400/70 -mt-1">
                  Save Lives Today
                </span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              Connecting blood donors with those in need. Our platform makes blood donation simple, 
              efficient, and life-saving.
            </p>
            <div className="flex items-center mt-4">
              <Heart className="w-5 h-5 text-blood-500 mr-2" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Join us in saving lives!
              </span>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-md font-bold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { name: 'Home', path: '/' },
                { name: 'Find Blood', path: '/find-blood' },
                { name: 'Become a Donor', path: '/become-donor' },
                { name: 'How It Works', path: '/#how-it-works' },
                { name: 'Contact Us', path: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-blood-500 dark:hover:text-blood-400 transition-colors duration-200 animated-link inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Legal */}
          <div className="col-span-1">
            <h3 className="text-md font-bold text-gray-900 dark:text-white mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              {[
                { name: 'Privacy Policy', path: '/privacy' },
                { name: 'Terms of Service', path: '/terms' },
                { name: 'Data Protection', path: '/data-protection' },
                { name: 'Cookie Policy', path: '/cookie-policy' },
                { name: 'FAQ', path: '/faq' },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-blood-500 dark:hover:text-blood-400 transition-colors duration-200 animated-link inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="col-span-1">
            <h3 className="text-md font-bold text-gray-900 dark:text-white mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              {[
                { icon: <Mail className="w-4 h-4" />, text: 'info@resqblood.com' },
                { icon: <Phone className="w-4 h-4" />, text: '+1 (555) 123-4567' },
                { 
                  icon: <MapPin className="w-4 h-4" />, 
                  text: '123 Life Avenue, Healthcare District, CA 90210, USA' 
                },
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="text-blood-500 mr-2 mt-1">
                    {item.icon}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
            
            {/* Social Media */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Follow Us
              </h4>
              <div className="flex space-x-3">
                {[
                  { icon: <Facebook className="w-4 h-4" />, label: 'Facebook' },
                  { icon: <Twitter className="w-4 h-4" />, label: 'Twitter' },
                  { icon: <Instagram className="w-4 h-4" />, label: 'Instagram' },
                  { icon: <Linkedin className="w-4 h-4" />, label: 'LinkedIn' },
                ].map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    aria-label={social.label}
                    className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-blood-500 hover:text-white dark:hover:bg-blood-500 transition-colors duration-200"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Partners */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 pb-6">
          <h3 className="text-center text-sm font-semibold text-gray-900 dark:text-white mb-6">
            Our Partners
          </h3>
          <div className="flex flex-wrap justify-center gap-8">
            {[...Array(6)].map((_, index) => (
              <div 
                key={index}
                className="bg-gray-100 dark:bg-gray-800 rounded-lg h-12 w-32 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-200"
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {['City Hospital', 'Red Cross', 'Memorial Medical', 'Life Foundation', 'Care Health', 'Blood Services'][index]}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Res-Q Blood. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Made with <Heart className="w-3 h-3 text-blood-500 inline" /> to save lives
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
