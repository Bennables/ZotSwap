import { useState, useEffect } from 'react';

export default function ProfileViewer() {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Fetch profiles from backend
    fetch('http://localhost:4000/api/users')
      .then(res => res.json())
      .then(data => setProfiles(data))
      .catch(err => console.error('Failed to fetch profiles', err));
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (profiles.length ? (prevIndex + 1) % profiles.length : 0));
  };

  //if (profiles.length === 0) return <p className="text-center">Loading profiles...</p>;

  const user = profiles[currentIndex] || {};

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-xl shadow-lg p-6 text-center">
      <h2 className="text-2xl font-bold mb-2">{user.name || 'No name provided'}</h2>
      <p className="text-gray-600 mb-1"> {user.location || 'Unknown location'}</p>
      <p className="text-gray-600 mb-1"> {user.year || 'Year not specified'}</p>
      <p className="text-gray-600 mb-1"> Talents: {user.talents || 'None listed'}</p>
      <p className="text-gray-600 mb-1"> Wants: {user.skillsWanted || 'No skills wanted listed'}</p>
      <p className="text-gray-600 mb-4"> Offers: {user.skillsOffered || 'No skills offered listed'}</p>

      <button
        onClick={handleNext}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Next Profile →
      </button>
    </div>
  );
}

