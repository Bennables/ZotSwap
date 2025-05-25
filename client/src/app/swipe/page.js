'use client';
import './styles.css';
import Navbar from '../components/NavigationBar';
import SwipeableCard from './swipeable';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

const App = () => {
  const { email } = useContext(AuthContext);

  return (
    <div>
      <h2>Swipe the Card</h2>
      {email ? (
        <SwipeableCard currentUserEmail={email} />
      ) : (
        <p>Loading user info...</p>
      )}
      <Navbar />
    </div>
  );
};

export default App;