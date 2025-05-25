'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import ProfileViewer from './components/ProfileViewer';
import SignUp from './components/SignUp';
import Navbar from './components/NavigationBar';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex justify-center">
      <div className="w-[393px] bg-white shadow-md">
        {/* Navigation Header */}
        <nav className="p-4 bg-white shadow-md">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              ZotSwap
            </Link>
            <div className="space-x-4">
              <Link href="/profile" className="text-gray-600 hover:text-blue-600">
                Profile
              </Link>
              <Link href="/auth/login" className="text-gray-600 hover:text-blue-600">
                Login
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="py-10 px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Welcome to ZotSwap
            </h1>
            <p className="text-md text-gray-600 mb-8">
              Connect with UCI students, share skills, and make new friends
            </p>
            <Link 
              href="/auth/signup" 
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid gap-6 mt-12">
            <div className="p-4 bg-white rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-2">Learn New Skills</h2>
              <p className="text-gray-600 text-sm">
                Discover and learn new skills from fellow UCI students
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-2">Share Your Expertise</h2>
              <p className="text-gray-600 text-sm">
                Teach others and develop your teaching abilities
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md">
              <Navbar />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

