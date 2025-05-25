'use client';
import './styles.css';
import Navbar from '../components/NavigationBar';
import SwipeableCard from './swipeable';
import Header from '../components/Header';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

const App = () => {
  const { userEmail, isInitialLoad } = useContext(AuthContext);

  return (
    <div>
      <Header />
      <div className="pt-16">
        {isInitialLoad ? (
          <p>Loading user info...</p>
        ) : userEmail ? (
          <SwipeableCard />
        ) : (
          <p>Please log in to view profiles.</p>
        )}
      </div>
      <Navbar />
    </div>
  );
};

export default App;