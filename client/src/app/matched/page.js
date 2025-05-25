'use client';

import './style.css';
import Navbar from '../components/NavigationBar';
import Matches from '../components/MatchesList';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

export default function MatchesPage() {
  const { email } = useContext(AuthContext);

  if (!email) {
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

      <div className="body">
        {/* Pass email to Matches so it can fetch matches for the logged-in user */}
        <Matches currentUserEmail={email} />
      </div>

      <Navbar />
    </main>
  );
}


