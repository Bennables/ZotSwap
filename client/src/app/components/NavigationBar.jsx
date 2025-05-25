'use client';
import { useRouter, usePathname } from 'next/navigation';
import { Home, User, SwitchCamera, Heart } from 'lucide-react';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[394px] z-50">
      <nav className="bg-white dark:bg-gray-800 border-t shadow-lg flex justify-around py-1 rounded-t-xl">

        <button onClick={() => router.push('/swipe')} className="flex flex-col items-center text-sm flex-1 py-2 px-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
          <div className={`h-1 w-full rounded-t-md ${isActive('/swipe') ? 'bg-[#88BDF2]' : 'bg-transparent'} transition-colors duration-200`}></div>
          <div className="flex flex-col items-center pt-1">
            <SwitchCamera className={`w-6 h-6 ${isActive('/swipe') ? 'text-blue-500' : 'text-gray-400'} hover:text-[#6A89A7] dark:hover:text-gray-300 transition-colors duration-200`} />
            <span className={`text-sm ${isActive('/swipe') ? 'text-blue-500' : 'text-gray-400'} hover:text-[#6A89A7] dark:hover:text-gray-300 transition-colors duration-200`}>Swap</span>
          </div>
        </button>

        <button onClick={() => router.push('/matched')} className="flex flex-col items-center text-sm flex-1 py-2 px-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
          <div className={`h-1 w-full rounded-t-md ${isActive('/matched') ? 'bg-[#88BDF2]' : 'bg-transparent'} transition-colors duration-200`}></div>
          <div className="flex flex-col items-center pt-1">
            <Heart className={`w-6 h-6 ${isActive('/matched') ? 'text-blue-500' : 'text-gray-400'} hover:text-[#6A89A7] dark:hover:text-gray-300 transition-colors duration-200`} />
            <span className={`text-sm ${isActive('/matched') ? 'text-blue-500' : 'text-gray-400'} hover:text-[#6A89A7] dark:hover:text-gray-300 transition-colors duration-200`}>Matches</span>
          </div>
        </button>

        <button onClick={() => router.push('/profile')} className="flex flex-col items-center text-sm flex-1 py-2 px-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
          <div className={`h-1 w-full rounded-t-md ${isActive('/profile') ? 'bg-[#88BDF2]' : 'bg-transparent'} transition-colors duration-200`}></div>
          <div className="flex flex-col items-center pt-1">
            <User className={`w-6 h-6 ${isActive('/profile') ? 'text-blue-500' : 'text-gray-400'} hover:text-[#6A89A7] dark:hover:text-gray-300 transition-colors duration-200`} />
            <span className={`text-sm ${isActive('/profile') ? 'text-blue-500' : 'text-gray-400'} hover:text-[#6A89A7] dark:hover:text-gray-300 transition-colors duration-200`}>Profile</span>
          </div>
        </button>
      </nav>
    </div>
  );
};

export default Navbar;


