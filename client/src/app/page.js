'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import ProfileViewer from './components/ProfileViewer';
import SignUp from './components/SignUp';
import Navbar from './components/NavigationBar';

export default function Home() {
  return (
    <div className="fixed inset-0 flex justify-center bg-gray-100">
      <div className="w-[393px] h-[852px] relative bg-[#F7FAFC] overflow-hidden">
        <main className="min-h-screen flex items-center justify-center bg-[#F7FAFC] p-4">
          <div className="w-full max-w-md p-8 rounded-3xl shadow-lg bg-[#F7FAFC] border border-[#6A89A7] flex flex-col items-center">
            <h1 className="text-2xl font-bold text-[#384959] mb-8 mt-2 text-center">Welcome to ZotSwap!</h1>
            <button className="w-full py-3 mb-4 rounded-full border border-[#6A89A7] text-[#384959] font-medium bg-[#6A89A7] hover:bg-[#384959] transition">Sign In with UCINETID</button>
            <button className="w-full py-3 mb-4 rounded-full border border-[#6A89A7] text-[#384959] font-medium bg-[#6A89A7] hover:bg-[#384959] transition">Sign In with Google</button>
            <button className="w-full py-3 mb-6 rounded-full border border-[#6A89A7] text-[#384959] font-medium bg-[#6A89A7] hover:bg-[#384959] transition">Sign In with Apple</button>
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
        </main>
      </div>
    </div>
  );
}

