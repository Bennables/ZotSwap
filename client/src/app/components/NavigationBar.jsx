'use client';
import { useRouter, usePathname } from 'next/navigation';
import { Home, User, SwitchCamera, Heart } from 'lucide-react';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[394px] z-50">
      <nav className="bg-white border-t shadow-lg flex justify-around py-3 rounded-t-xl">
        <button onClick={() => router.push('/')} className="flex flex-col items-center text-sm">
          <Home className={`w-6 h-6 ${isActive('/') ? 'text-blue-500' : 'text-gray-400'}`} />
          <span className={isActive('/') ? 'text-blue-500' : 'text-gray-400'}>Home</span>
        </button>

        <button onClick={() => router.push('/swipe')} className="flex flex-col items-center text-sm">
          <SwitchCamera className={`w-6 h-6 ${isActive('/swipe') ? 'text-blue-500' : 'text-gray-400'}`} />
          <span className={isActive('/swipe') ? 'text-blue-500' : 'text-gray-400'}>Swap</span>
        </button>

        <button onClick={() => router.push('/matched')} className="flex flex-col items-center text-sm">
          <Heart className={`w-6 h-6 ${isActive('/matched') ? 'text-blue-500' : 'text-gray-400'}`} />
          <span className={isActive('/matched') ? 'text-blue-500' : 'text-gray-400'}>Matches</span>
        </button>

        <button onClick={() => router.push('/profile')} className="flex flex-col items-center text-sm">
          <User className={`w-6 h-6 ${isActive('/profile') ? 'text-blue-500' : 'text-gray-400'}`} />
          <span className={isActive('/profile') ? 'text-blue-500' : 'text-gray-400'}>Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default Navbar;


