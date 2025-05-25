import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaChevronRight } from 'react-icons/fa';

export default function MatchesViewer({ currentUserEmail }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/users/email/${currentUserEmail}/matches`);
        if (!res.ok) throw new Error('Failed to fetch matches');
        const data = await res.json();
        // If no matches are fetched, use sample data for demo
        setMatches(data.length > 0 ? data : [
          { _id: 'sample1', name: 'Sample User 1', location: 'Sample Location', skillsWanted: ['Sample Skill 1'], skillsOffered: ['Sample Skill A'] },
          { _id: 'sample2', name: 'Sample User 2', location: 'Another Location', skillsWanted: ['Sample Skill 2', 'Sample Skill 3'], skillsOffered: ['Sample Skill B'] },
        ]);
      } catch (err) {
        console.error('Failed to fetch matches', err);
        // Also use sample data on error
        setMatches([
          { _id: 'sample1', name: 'Sample User 1', location: 'Sample Location', skillsWanted: ['Sample Skill 1'], skillsOffered: ['Sample Skill A'] },
          { _id: 'sample2', name: 'Sample User 2', location: 'Another Location', skillsWanted: ['Sample Skill 2', 'Sample Skill 3'], skillsOffered: ['Sample Skill B'] },
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (currentUserEmail) fetchMatches();
  }, [currentUserEmail]);

  if (loading) return <p className="text-center">Loading matches...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-[#384959] dark:text-white">Your Matches</h2>
      {matches.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No matches yet.</p>
      ) : (
        matches.map((user) => (
          <div 
            key={user._id} 
            className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 px-4"
            onClick={() => router.push(`/chat?userId=${user._id}`)}
          >
            <div>
              <h3 className="text-xl font-semibold text-[#384959] dark:text-white">{user.name}</h3>
              <p className="text-gray-600 text-sm dark:text-gray-300">Wants: {user.skillsWanted?.join(', ') || 'None listed'}</p>
              <p className="text-gray-600 text-sm dark:text-gray-300">Offers: {user.skillsOffered?.join(', ') || 'None listed'}</p>
            </div>
            <FaChevronRight className="text-[#6A89A7] dark:text-gray-400 w-5 h-5" />
          </div>
        ))
      )}
    </div>
  );
}