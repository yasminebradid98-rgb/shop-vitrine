"use client";
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-[#1a3a3a] text-white p-4 md:p-5 shadow-xl sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo cliquable pour revenir à l'accueil */}
        <Link href="/" className="flex items-center gap-4 group">
          <img 
            src="/LOGO.png" 
            alt="Roadz Logo" 
            className="h-16 md:h-20 w-auto transition-transform duration-300 group-hover:scale-105" 
          />
        </Link>

        {/* Liens de navigation */}
        <div className="flex items-center gap-8 md:gap-12">
          <Link 
            href="/" 
            className="text-sm font-semibold uppercase tracking-widest hover:text-gray-300 transition-colors relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-white after:left-0 after:-bottom-1 hover:after:w-full after:transition-all duration-300"
          >
            Home
          </Link>
          
          <Link 
            href="/about" 
            className="text-sm font-semibold uppercase tracking-widest hover:text-gray-300 transition-colors relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-white after:left-0 after:-bottom-1 hover:after:w-full after:transition-all duration-300"
          >
            About Us
          </Link>
        </div>
      </div>
    </nav>
  );
}