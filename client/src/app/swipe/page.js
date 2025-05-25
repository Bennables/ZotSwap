'use client';

import Layout from '../components/Layout';
import Navbar from '../components/NavigationBar';
import SwipeableCard from './Swipeable';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

export default function SwipePage() {
  const { email } = useContext(AuthContext);

  return (
    <Layout>
      <div className="flex-1 p-4">
        <h2 className="text-2xl font-bold text-[#384959] mb-6">Swipe the Card</h2>
        {email ? (
          <SwipeableCard currentUserEmail={email} />
        ) : (
          <p className="text-center text-gray-500">Loading user info...</p>
        )}
      </div>
      <Navbar />
    </Layout>
  );
}