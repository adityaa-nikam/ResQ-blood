
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, Search } from 'lucide-react';
import BloodDropLogo from './BloodDropLogo';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Find Blood', path: '/find-blood' },
    { name: 'Become a Donor', path: '/become-donor' },
    { name: 'How It Works', path: '/#how-it-works' },
    { name: 'Contact Us', path: '/contact' },
  ];
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 group"
          aria-label="Res-Q Blood Home"
        >
          <BloodDropLogo className="group-hover:animate-drop-float" size={40} />
          <div className="flex flex-col">
            <span className="font-bold text-xl text-blood-600 dark:text-blood-500 tracking-tight">
              Res-Q Blood
            </span>
            <span className="text-xs text-blood-500/70 dark:text-blood-400/70 -mt-1">
              Save Lives Today
            </span>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-gray-700 dark:text-gray-200 font-medium animated-link py-2"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        
        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <button 
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </button>
          
          <Link
            to="/login"
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-transparent border border-blood-500 text-blood-600 dark:text-blood-400 hover:bg-blood-50 dark:hover:bg-blood-900/20 transition-colors duration-200"
          >
            <User className="w-4 h-4" />
            <span>Login</span>
          </Link>
          
          <Link
            to="/signup"
            className="px-5 py-2 rounded-full bg-blood-500 text-white hover:bg-blood-600 transition-colors duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 transform transition-transform"
          >
            Sign Up
          </Link>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex items-center text-gray-700 dark:text-gray-200"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg py-4 px-4 flex flex-col space-y-3 animate-fade-in">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-gray-800 dark:text-gray-200 font-medium py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 py-2 rounded-lg bg-transparent border border-blood-500 text-blood-600 dark:text-blood-400"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User className="w-4 h-4" />
              <span>Login</span>
            </Link>
            <Link
              to="/signup"
              className="py-2 rounded-lg bg-blood-500 text-white text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
