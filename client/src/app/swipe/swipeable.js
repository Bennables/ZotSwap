'use client';
import { useSwipeable } from 'react-swipeable';
import { useState, useEffect } from 'react';
import { animate } from 'motion';
import { useRouter } from 'next/navigation';
import "./styles.css";

export default function SwipeableCard() {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDir, setSwipeDir] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Fetch profiles from backend
    fetch('http://localhost:4000/api/users')
      .then(res => res.json())
      .then(data => {
        // Set all profiles without filtering
        console.log('Fetched profiles for swipe (no filtering):', data);
        setProfiles(data);
      })
      .catch(err => console.error('Failed to fetch profiles', err));
  }, []);

  const user = profiles[currentIndex] || {};

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (profiles.length ? (prevIndex + 1) % profiles.length : 0));
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
      setSwipeDir("Swiped Left");
      if (swipeEventData.event.target) {
        animate(swipeEventData.event.target, { opacity: 0, x: -500 }, { duration: 0.3 }).finished.then(() => {
           handleNext();
           // Reset animation properties for the next card to appear correctly
           if(swipeEventData.event.target) {
               animate(swipeEventData.event.target, { opacity: 1, x: 0 }, { duration: 0 });
           }
        });
      }
    },
    onSwipedRight: (swipeEventData) => {
      setSwipeDir('Swiped Right');
      if (swipeEventData.event.target) {
        animate(swipeEventData.event.target, { opacity: 0, x: 500 }, { duration: 0.3 }).finished.then(() => {
          handleLike();
          handleNext();
          // Reset animation properties for the next card to appear correctly
           if(swipeEventData.event.target) {
               animate(swipeEventData.event.target, { opacity: 1, x: 0 }, { duration: 0 });
           }
        });
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: true // allows testing on desktop
  });

  if (profiles.length === 0) return <p className="text-center">Loading profiles...</p>;

  return (
    <div {...handlers} className='ggggg'>
      <div className="max-w-sm mx-auto mt-10 bg-white rounded-xl shadow-lg p-6 text-center">
        <img
          src={user.profilePicture || '/images/default-profile.png'}
          className="w-28 h-28 rounded-full mx-auto mb-4 object-cover shadow-md"
          alt={`${user.firstName || user.name || 'User'}'s profile`}
        />
  
        <h3 className="text-lg font-bold">
          {(user.firstName && user.lastName) ? `${user.firstName} ${user.lastName}` : user.name || 'Name'} <span className="font-normal">{user.age || ''}</span>
        </h3>

        {user.email && (
          <div className="text-[#384959] mb-2">
            <p>{user.email}</p>
          </div>
        )}

        <div className="text-[#384959] mb-6">
          <p>{user.location || 'Location'} • {user.year || 'Year'}</p>
        </div>

        <div className="bg-white rounded-lg p-4 mb-4 shadow-md">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-[#384959] mb-2">Skills I have!</h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {user.skillsOffered && user.skillsOffered.map((skill, index) => (
                <span
                  key={index}
                  className="bg-[#6A89A7] text-white px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
  
          <div>
            <h2 className="text-lg font-semibold text-[#384959] mb-2">Skills I want!</h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {user.skillsWanted && user.skillsWanted.map((skill, index) => (
                <span
                  key={index}
                  className="bg-[#BDDDFC] text-[#384959] px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
  
        {user.talents && (
          <div className="bg-white rounded-lg p-4 mb-4 shadow-md">
            <h2 className="text-lg font-semibold text-[#384959] mb-2">Talents</h2>
            <p className="text-[#6A89A7]">{user.talents}</p>
          </div>
        )}
      </div>
    </div>
  );
}
