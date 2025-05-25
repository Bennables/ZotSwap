

'use client';
import './styles.css'
import Navbar from '../components/NavigationBar';
// App.js or page.js
import SwipeableCard from './Swipeable';
import Header from '../components/ZotHeader';

const App = () => {
  return (
    <main>
      <div> 
        <Header />
      
        <SwipeableCard content="👋 Swipe Me!" />
        <Navbar />
      </div>
    </main>
  );
};


export default App;