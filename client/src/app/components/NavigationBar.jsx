'use client';
import { useRouter, usePathname } from 'next/navigation';
import { User, SwitchCamera, Heart } from 'lucide-react';
import Button from './Button';

const NavButton = ({ icon: Icon, label, path }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === path;

  return (
    <Button
      onClick={() => router.push(path)}
      variant={isActive ? 'primary' : 'outline'}
      className={`
        group relative flex flex-col items-center py-2 px-4
        transition-all duration-300 ease-in-out
        bg-transparent hover:bg-transparent
        border-none shadow-none
        min-w-[80px]
      `}
    >
      {/* Active indicator line */}
      <div className={`
        absolute -top-[1px] left-1/2 -translate-x-1/2
        w-12 h-0.5 rounded-full bg-[#6A89A7]
        transition-all duration-300
        ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
      `} />

      {/* Icon with animations */}
      <Icon className={`
        w-6 h-6 mb-1
        transition-all duration-300 ease-out
        ${isActive 
          ? 'text-[#6A89A7] scale-110' 
          : 'text-gray-400 group-hover:text-[#6A89A7]/60 group-hover:scale-105'
        }
      `} />

      {/* Label with animations */}
      <span className={`
        text-xs font-medium
        transition-all duration-300
        ${isActive 
          ? 'text-[#6A89A7]' 
          : 'text-gray-400 group-hover:text-[#6A89A7]/60'
        }
      `}>
        {label}
      </span>
    </Button>
  );
};

const Navbar = () => {
  const navItems = [
    { path: '/swipe', icon: SwitchCamera, label: 'Swap' },
    { path: '/matched', icon: Heart, label: 'Matches' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[393px] z-[9999]">
      <nav className="
        bg-white/95 dark:bg-gray-900/95
        border-t border-[#6A89A7]/10
        shadow-lg shadow-[#6A89A7]/5
        flex justify-between items-center
        px-4 rounded-t-xl
        backdrop-blur-sm
      ">
        {navItems.map((item) => (
          <NavButton key={item.path} {...item} />
        ))}
      </nav>
    </div>
  );
};

export default Navbar;


