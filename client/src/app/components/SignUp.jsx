import { useState, useEffect } from 'react';

export default function ProfileViewer() {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch profiles from backend on port 4000
    fetch('http://localhost:4000/api/users')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Received data:', data);
        console.log('First profile:', data[0]);
        setProfiles(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch profiles', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (profiles.length ? (prevIndex + 1) % profiles.length : 0));
  };

  if (loading) return <p className="text-center">Loading profiles...</p>;
  
  if (error) return (
    <div className="text-center text-red-500">
      <p>Error loading profiles: {error}</p>
      <p className="text-sm mt-2">Make sure your backend server is running on port 4000</p>
    </div>
  );

  if (profiles.length === 0) return <p className="text-center">No profiles found</p>;

  const user = profiles[currentIndex] || {};
  
  // Debug logging
  console.log('Current user:', user);
  console.log('Current index:', currentIndex);
  console.log('All profiles:', profiles);

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-xl shadow-lg p-6 text-center">
      <h2 className="text-2xl font-bold mb-2">{user.name || 'No name provided'}</h2>
      <p className="text-gray-600 mb-1"> {user.location || 'Unknown location'}</p>
      <p className="text-gray-600 mb-1"> {user.year || 'Year not specified'}</p>
      <p className="text-gray-600 mb-1"> Talents: {user.talents || 'None listed'}</p>
      <p className="text-gray-600 mb-1"> Wants: {user.skillsWanted || 'No skills wanted listed'}</p>
      <p className="text-gray-600 mb-4"> Offers: {user.skillsOffered || 'No skills offered listed'}</p>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {currentIndex + 1} of {profiles.length}
        </span>
        <button
          onClick={handleNext}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Next Profile →
        </button>
      </div>
    </div>
  );
}