'use client';

import React, { useState, useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import ProfileViewer from './components/ProfileViewer';
import SignUp from './components/SignUp';
import Navbar from './components/NavigationBar';
import { useRouter } from 'next/navigation';
import { AuthContext } from './context/authContext';

export default function Home() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { setUserEmail } = useContext(AuthContext);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login with identifier:', identifier);
      
      const response = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();
      console.log('Full login response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Sign in failed');
      }

      // Check if we have the user ID in the response
      if (!data.user || !data.user.id) {
        console.error('No user ID in response:', data);
        throw new Error('Login response missing user ID');
      }

      // Store both token and user ID in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user.id);
      
      // Set user email in context
      setUserEmail(data.user.email);
      
      console.log('Login successful. Stored user ID:', data.user.id);
      console.log('Stored token:', data.token);
      console.log('Stored userEmail:', data.user.email);
      
      // Verify the data was stored
      console.log('Verifying localStorage:', {
        userId: localStorage.getItem('userId'),
        token: localStorage.getItem('token')
      });
      
      // Redirect to the main app page
      router.push('/swipe');

    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-[#F7FAFC] rounded-3xl shadow-lg border border-[#6A89A7] flex flex-col items-center overflow-hidden md:h-auto">
        <div className="w-full p-8 flex flex-col items-center">
          <h1 className="text-2xl font-bold text-[#384959] mb-8 mt-2 text-center">Welcome to ZotSwap!</h1>

          <form onSubmit={handleSignIn} className="w-full">
            <div className="mb-4 w-full">
              <label className="block text-[#384959] text-sm font-semibold mb-2" htmlFor="identifier">Identifier (Email, Username, or Phone)</label>
              <input
                className="shadow appearance-none border border-[#6A89A7] rounded w-full py-2 px-3 text-[#384959] leading-tight focus:outline-none focus:shadow-outline"
                id="identifier"
                type="text"
                placeholder="Email, Username, or Phone"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="mb-6 w-full">
              <label className="block text-[#384959] text-sm font-semibold mb-2" htmlFor="password">Password</label>
              <input
                className="shadow appearance-none border border-[#6A89A7] rounded w-full py-2 px-3 text-[#384959] leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="**********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            
            {error && <p className="text-red-500 text-xs italic mb-4 text-center">{error}</p>}

            <button
              className="w-full py-3 mb-4 rounded-full border border-[#6A89A7] text-[#384959] font-medium bg-[#88BDF2] hover:bg-[#6A89A7] transition disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

            <div className="flex items-center w-full mb-4">
              <div className="flex-grow border-t border-[#6A89A7]" />
              <span className="mx-2 text-[#384959] text-sm">Don't have a ZotSwap account?</span>
              <div className="flex-grow border-t border-[#6A89A7]" />
            </div>
            <Link href="/signup" className="w-full">
              <button className="w-full py-3 rounded-full border border-[#6A89A7] text-[#384959] font-medium bg-[#F7B267] hover:bg-[#6A89A7] transition">
                Register
              </button>
            </Link>
          </div>
      </div>
    </div>
  );
}
