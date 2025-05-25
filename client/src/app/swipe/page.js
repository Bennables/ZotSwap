

'use client';
import './styles.css'
import Navbar from '../components/NavigationBar';
// App.js or page.js
import SwipeableCard from './Swipeable';

const App = () => {
  return (
    <div>
    <h2>Swipe the Card</h2>
    
      <SwipeableCard content="👋 Swipe Me!" />
      <Navbar />
    </div>
    
  );
};


export default App;