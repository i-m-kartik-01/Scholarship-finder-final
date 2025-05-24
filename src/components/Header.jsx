import React from 'react';
import { GraduationCap, Home } from 'lucide-react';

const Header = ({ resetForm }) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div 
            className="flex items-center cursor-pointer mb-4 md:mb-0" 
            onClick={resetForm}
          >
            <GraduationCap size={28} className="mr-2" />
            <h1 className="text-xl md:text-2xl font-bold font-heading">
              Scholarship Finder
            </h1>
          </div>
          
          <nav>
            <ul className="flex space-x-6">
              <li>
                <button 
                  onClick={resetForm}
                  className="flex items-center hover:text-blue-200 transition-colors"
                >
                  <Home size={18} className="mr-1" />
                  <span>Home</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;