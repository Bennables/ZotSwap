'use client';
import { useEffect } from 'react';

export default function Layout({ children }) {
  // Handle viewport height for mobile
  useEffect(() => {
    const setVH = () => {
      document.documentElement.style.setProperty(
        '--vh', 
        `${window.innerHeight * 0.01}px`
      );
    };
    setVH();
    window.addEventListener('resize', setVH);
    return () => window.removeEventListener('resize', setVH);
  }, []);

  return (
    <div className="min-h-[852px] w-[393px] mx-auto bg-[#F7FAFC] dark:bg-gray-900 
      text-[#384959] dark:text-gray-100 flex flex-col relative">
      {children}
    </div>
  );
}