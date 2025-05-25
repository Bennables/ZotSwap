'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditProfile() {
  const router = useRouter();
  
  return (
    <div className="fixed inset-0 flex justify-center bg-gray-100">
      <div className="w-[393px] h-[852px] relative bg-white overflow-hidden">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-[#384959] mb-6">Edit Profile</h1>
          {/* Add your edit form here */}
        </div>
      </div>
    </div>
  );
}