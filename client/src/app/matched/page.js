'use client';

import './style.css';
import Navbar from '../components/NavigationBar';
import Matches from '../components/MatchesList';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

export default function MatchesPage() {
  const { userEmail } = useContext(AuthContext);

  if (!userEmail) {
    return (
      <main>
        <div className="top">
          <h1>Please log in to see your matches</h1>
        </div>
        <Navbar />
      </main>
    );
  }

  return (
    <main>
      <div className="top">
        <h1>Matches</h1>
      </div>
      <div className="pt-16 body">
        <Matches currentUserEmail={userEmail} />
      </div>

      <Navbar />
    </main>
  );
}


