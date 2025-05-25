'use client';

import './style.css';
import Navbar from '../components/NavigationBar';
import Matches from '../components/MatchesList';

export default function MatchesPage() {
  const matches = [
    { id: 1, name: "Jessica", teach: "Math", learn: "Guitar", status: "Matched 2h ago" },
    { id: 2, name: "Daniel", teach: "Programming", learn: "Spanish", status: "Matched 1d ago" },
    { id: 3, name: "Emily", teach: "Cooking", learn: "Yoga", status: "Matched 3d ago" }
  ];

  return (
    <main>
      <div className="top">
        <h1>Matches</h1>
      </div>

      <div className="body">
        <Matches />
      </div>

      <Navbar />
    </main>
  );
}

