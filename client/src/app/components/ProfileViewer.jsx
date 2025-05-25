import { useState, useEffect } from 'react';


export default function ProfileViewer({currentUserId}) {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Fetch profiles from backend
    fetch('http://localhost:4000/api/users')
      .then(res => res.json())
      .then(data => {
        const filteredProfiles = data.filter(profile => profile._id !== currentUserId);
        setProfiles(filteredProfiles);
      })
      .catch(err => console.error('Failed to fetch profiles', err));
  }, [currentUserId]);
  

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (profiles.length ? (prevIndex + 1) % profiles.length : 0));
  };

  const handleLike = async () => {
    const senderId = currentUserId; // Replace with actual logged-in user ID
    const receiverId = user._id;
  
    await fetch('http://localhost:4000/api/users/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId, receiverId })
    });
  };
  
  if (profiles.length === 0) return <p className="text-center">Loading profiles...</p>;

  const user = profiles[currentIndex] || {};

  return (
    <div className="max-w-sm mx-auto mt-10 bg-white rounded-xl shadow-lg p-6 text-center">
  
      <img
        src={user.profilePicture || '/images/default-profile.png'}
        className="w-28 h-28 rounded-full mx-auto mb-4 object-cover shadow-md"
        alt={`${user.firstName} ${user.lastName}'s profile`}
      />
  
      <h3 className="text-lg font-bold">
        {user.firstName} {user.lastName} <span className="font-normal">{user.age || ''}</span>
      </h3>
  
      <div className="text-md font-semibold my-2">About Me</div>
  
      <div className="text-md font-semibold mb-1">Skills I have!</div>
      <p className="text-gray-600 mb-4">{user.skillsOffered?.join(', ') || 'No skills offered listed'}</p>
  
      <div className="text-md font-semibold mb-1">Skills I want!</div>
      <p className="text-gray-600 mb-4">{user.skillsWanted?.join(', ') || 'No skills wanted listed'}</p>
  
      <div className="flex justify-center space-x-6 mt-6">
        <button
          onClick={handleLike}
          className="bg-green-500 hover:bg-green-600 text-white w-10 h-10 rounded-full text-xl"
        >
          ✓
        </button>
        <button
          onClick={handleNext}
          className="bg-red-500 hover:bg-red-600 text-white w-10 h-10 rounded-full text-xl"
        >
          ✕
        </button>
      </div>

    </div>
  );
  
}

