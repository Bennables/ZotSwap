import { useState, useEffect } from 'react';

export default function MatchesViewer({ currentUserEmail }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/users/email/${currentUserEmail}/matches`);
        if (!res.ok) throw new Error('Failed to fetch matches');
        const data = await res.json();
        setMatches(data);
      } catch (err) {
        console.error('Failed to fetch matches', err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUserEmail) fetchMatches();
  }, [currentUserEmail]);

  if (loading) return <p className="text-center">Loading matches...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Your Matches</h2>
      {matches.length === 0 ? (
        <p className="text-center text-gray-500">No matches yet.</p>
      ) : (
        matches.map((user) => (
          <div key={user._id} className="border-b py-4">
            <h3 className="text-xl font-semibold">{user.name}</h3>
uploading
            <p className="text-gray-600"> {user.location || 'Unknown'}</p>
            <p className="text-gray-600"> Wants: {user.skillsWanted || 'None listed'}</p>
            <p className="text-gray-600"> Offers: {user.skillsOffered || 'None listed'}</p>
            <p className="text-gray-600">{user.location || 'Unknown'}</p>
            <p className="text-gray-600">Talents: {user.talents || 'None listed'}</p>
            <p className="text-gray-600">Wants: {user.skillsWanted || 'None listed'}</p>
            <p className="text-gray-600">Offers: {user.skillsOffered || 'None listed'}</p>
main
          </div>
        ))
      )}
    </div>
  );
}