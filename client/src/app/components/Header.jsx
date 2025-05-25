import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = () => {
    if (window.scrollY > lastScrollY && window.scrollY > 50) {
      setIsVisible(false);
    } else if (window.scrollY < lastScrollY) {
      setIsVisible(true);
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header className={`fixed top-0 left-0 right-0 bg-[#BDDDFC] dark:bg-gray-800 text-[#384959] dark:text-white p-4 flex items-center justify-center shadow-md z-10 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <Link href="/">
        <div className="flex items-center">
          <Image
            src="/ZotSwap_Logo2.png"
            alt="ZotSwap Logo"
            width={32}
            height={32}
            priority
          />
          <span className="ml-2 text-xl font-bold">ZotSwap</span>
        </div>
      </Link>
    </header>
  );
} 