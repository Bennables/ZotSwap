'use client';
import { useSwipeable } from 'react-swipeable';
import { useState, useEffect } from 'react';
import { animate } from 'motion';
import { useRouter } from 'next/navigation';
import "./styles.css";

export default function SwipeableCard() {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState([]); // State to store indices of viewed profiles
  const router = useRouter();

  useEffect(() => {
    // Get current user ID from localStorage
    const currentUserId = localStorage.getItem('userId');
    console.log('Current User ID from localStorage:', currentUserId);

    // Fetch profiles from backend
    fetch('http://localhost:4000/api/users')
      .then(res => res.json())
      .then(data => {
        // Log the structure of fetched user data for debugging
        if (data && data.length > 0) {
          console.log('Structure of first fetched user object:', data[0]);
        }
        
        // Filter out the current user's profile
        const filteredProfiles = data.filter(user => user._id !== currentUserId);
        console.log('Filtered profiles (excluding current user):', filteredProfiles);
        setProfiles(filteredProfiles);
      })
      .catch(err => console.error('Failed to fetch profiles', err));
  }, []);

  const user = profiles[currentIndex] || {};

  const handleNext = () => {
    // Add current index to history before moving to the next
    setHistory(prevHistory => [...prevHistory, currentIndex]);
    setCurrentIndex((prevIndex) => (profiles.length ? (prevIndex + 1) % profiles.length : 0));
  };

  const handleUndo = () => {
    if (history.length === 0) return; // Cannot undo if no history

    const prevIndex = history[history.length - 1]; // Get the last index from history
    setHistory(prevHistory => prevHistory.slice(0, -1)); // Remove the last index from history
    setCurrentIndex(prevIndex); // Go back to the previous index
  };

  const handleLike = async () => {
    const senderEmail = currentUserEmail; // Logged-in user email
    const receiverEmail = user.email;

    try {
      await fetch('http://localhost:4000/api/users/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderEmail, receiverEmail }),
      });
      // Optionally handle response or update UI on success
    } catch (error) {
      console.error('Failed to send like:', error);
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: (swipeEventData) => {
      const card = document.querySelector('.swipeable-card');
      if (card) {
        // Add temporary class for visual feedback
        card.classList.add('swiped-left');
        animate(card, { opacity: 0, x: -500 }, { duration: 0.3 }).finished.then(() => {
           // Remove temporary class and reset animation properties
           card.classList.remove('swiped-left');
           handleNext();
           animate(card, { opacity: 1, x: 0 }, { duration: 0 });
        });
      }
    },
    onSwipedRight: (swipeEventData) => {
      const card = document.querySelector('.swipeable-card');
      if (card) {
        // Add temporary class for visual feedback
        card.classList.add('swiped-right');
        animate(card, { opacity: 0, x: 500 }, { duration: 0.3 }).finished.then(() => {
          // Remove temporary class and reset animation properties
          card.classList.remove('swiped-right');
          handleLike();
          handleNext();
          animate(card, { opacity: 1, x: 0 }, { duration: 0 });
        });
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: true // allows testing on desktop
  });

  if (profiles.length === 0) return (
    <div className="flex items-center justify-center h-[852px] w-[393px] bg-[#F7FAFC] dark:bg-gray-900">
      <p className="text-[#384959] dark:text-gray-200 text-lg">Loading profiles...</p>
    </div>
  );

  return (
    <div className="relative h-[852px] w-[393px] mx-auto bg-[#F7FAFC] dark:bg-gray-900">
      <div {...handlers} className="h-[calc(100%-80px)] w-full overflow-y-auto">
        <div className="swipeable-card bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center transition-all duration-200 hover:shadow-lg max-w-sm mx-auto">
          <div className="relative w-28 h-28 mx-auto mb-6">
            <img
              src={user.profilePicture || '/images/default-profile.png'}
              className="w-full h-full rounded-full object-cover shadow-md border-4 border-[#6A89A7] dark:border-gray-600"
              alt={`${user.firstName || user.name || 'User'}'s profile`}
            />
          </div>
    
          <h3 className="text-xl font-bold text-[#384959] dark:text-white mb-2">
            {(user.firstName && user.lastName) ? `${user.firstName} ${user.lastName}` : user.name || 'Name'} 
            {user.age && <span className="font-normal text-[#6A89A7] dark:text-gray-400"> • {user.age}</span>}
          </h3>

          {user.email && (
            <div className="text-[#6A89A7] dark:text-gray-400 mb-4">
              <p>{user.email}</p>
            </div>
          )}

          <div className="text-[#384959] dark:text-gray-300 mb-6">
            <p>{user.location || 'Location'} • {user.year || 'Year'}</p>
          </div>

          {/* About Me Section */}
          <div className="bg-[#F7FAFC] dark:bg-gray-700 rounded-lg p-4 mb-6 hover:shadow-xl transition-shadow duration-200">
            <h2 className="text-lg font-semibold text-[#384959] dark:text-white mb-3">About Me</h2>
            <p className="text-[#384959] dark:text-gray-300 text-sm leading-relaxed">
              {user.bio || "Hi! I'm passionate about learning and sharing skills. I believe in the power of community and collaboration. Let's connect and grow together!"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-[#F7FAFC] dark:bg-gray-700 rounded-lg p-4 hover:shadow-xl transition-shadow duration-200">
              <h2 className="text-lg font-semibold text-[#384959] dark:text-white mb-3">Skills I have!</h2>
              <div className="flex flex-wrap gap-2 justify-center">
                {user.skillsOffered && user.skillsOffered.map((skill, index) => (
                  <div
                    key={index}
                    className="m-1"
                  >
                    <span className="bg-[#6A89A7] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-opacity-90 transition-colors transform hover:scale-105 inline-block">
                      {skill}
                    </span>
                  </div>
                ))}
              </div>
            </div>
    
            <div className="bg-[#F7FAFC] dark:bg-gray-700 rounded-lg p-4 hover:shadow-xl transition-shadow duration-200">
              <h2 className="text-lg font-semibold text-[#384959] dark:text-white mb-3">Skills I want!</h2>
              <div className="flex flex-wrap gap-2 justify-center">
                {user.skillsWanted && user.skillsWanted.map((skill, index) => (
                  <div
                    key={index}
                    className="m-1"
                  >
                    <span className="bg-[#384959] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-opacity-90 transition-colors transform hover:scale-105 inline-block">
                      {skill}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom buttons container (empty now) */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-white dark:bg-gray-800 flex items-center justify-center space-x-6 shadow-lg">
        {/* Buttons were here */}
      </div>

       {/* Undo Button - Fixed Bottom Left */}
       <button
         onClick={handleUndo}
         disabled={history.length === 0} // Disable if no history
         className={`fixed bottom-4 left-4 w-16 h-16 rounded-full bg-[#F7B267] text-[#384959] flex items-center justify-center shadow-lg transition-colors z-50 ${history.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'}`}
         aria-label="Undo swipe"
       >
         <span className="text-2xl">↺</span>
       </button>

    </div>
  );
}
