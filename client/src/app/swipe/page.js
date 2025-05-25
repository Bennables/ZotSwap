'use client';
import Layout from '../components/Layout';
import Navbar from '../components/NavigationBar';
import SwipeableCard from './Swipeable';

export default function SwipePage() {
  return (
    <Layout>
      <div className="flex-1 p-4">
        <h2 className="text-2xl font-bold text-[#384959] mb-6">Swipe the Card</h2>
        <SwipeableCard content="👋 Swipe Me!" />
      </div>
      <Navbar />
    </Layout>
  );
}