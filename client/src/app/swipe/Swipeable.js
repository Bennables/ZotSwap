'use client';
import { useSwipeable } from 'react-swipeable';
import { useState, useEffect } from 'react';
import { animate } from 'motion';
import { useRouter } from 'next/navigation';
import "./styles.css";

export default function SwipeableCard({ currentUserEmail }) {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDir, setSwipeDir] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Fetch profiles from backend
    fetch('http://localhost:4000/api/users')
      .then(res => res.json())
      .then(data => {
        // Filter out current user by email
        const filteredProfiles = data.filter(profile => profile.email !== currentUserEmail);
        setProfiles(filteredProfiles);
      })
      .catch(err => console.error('Failed to fetch profiles', err));
  }, [currentUserEmail]);

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
        handleNext();
        animate(swipeEventData.event.target, { opacity: 0.1, x: -1300 }, { duration: 0.5 });
      }
    },
    onSwipedRight: (swipeEventData) => {
      setSwipeDir('Swiped Right');
      if (swipeEventData.event.target) {
        handleLike();
        handleNext();
        animate(swipeEventData.event.target, { opacity: 0.1, x: 1300 }, { duration: 0.5 });
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
          src={user.profilePicture || '/mnt/data/PFP.png'}
          className="w-28 h-28 rounded-full mx-auto mb-4 object-cover shadow-md"
          alt={`${user.name}'s profile`}
        />

        <h3 className="text-lg font-bold">
          {user.name || 'Name'} <span className="font-normal">{user.age || ''}</span>
        </h3>

        <div className="text-md font-semibold my-2">About Me</div>

        <div className="text-md font-semibold mb-1">Skills I have!</div>
        <p className="text-gray-600 mb-4">{user.skillsOffered || 'No skills offered listed'}</p>

        <div className="text-md font-semibold mb-1">Skills I want!</div>
        <p className="text-gray-600 mb-4">{user.skillsWanted || 'No skills wanted listed'}</p>
      </div>
    </div>
  );
}