'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      const headerHeight = 64; // Matches the h-16 class (16 * 4 = 64px)
      
      setIsScrolled(offset > headerHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`
        bg-white 
        shadow-sm 
        ${isScrolled 
          ? 'fixed top-0 left-0 right-0 z-50 animate-slide-down' 
          : 'relative'}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              OmniPost
            </Link>
          </div>
          <nav className="flex space-x-8">
            <Link href="/articles" className="text-gray-700 hover:text-gray-900">
              Articles
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900">
              Contact
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-gray-900">
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
