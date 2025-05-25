'use client';

import dynamic from 'next/dynamic';
import Navbar from '../components/NavigationBar';

/* Dynamically import ProfileViewer to avoid SSR issues */
const ProfileViewer = dynamic(() => import('../components/SignUp'), {
  ssr: false,
});

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex justify-center">
      <div className="w-[393px] bg-white shadow-md">
        <div className="p-4">
          <ProfileViewer />
        </div>
        <div className="p-4">
          <Navbar />
        </div>
      </div>
    </main>
  );
}


