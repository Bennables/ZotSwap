'use client';
import './styles.css';
import Navbar from '../components/NavigationBar';
import SwipeableCard from './swipeable';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

const App = () => {
  const { userEmail, isInitialLoad } = useContext(AuthContext);

  return (
    <div>
      <h2>Swipe the Card</h2>
      {isInitialLoad ? (
        <p>Loading user info...</p>
      ) : userEmail ? (
        <SwipeableCard />
      ) : (
        <p>Please log in to view profiles.</p>
      )}
      <Navbar />
    </div>
  );
};

export default App;