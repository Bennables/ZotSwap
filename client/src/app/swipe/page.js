

'use client';
import './styles.css'

import { animate } from "motion"
// App.js or page.js
import SwipeableCard from './Swipeable';

const App = () => {
  return (
    <div>
    <h2>Swipe the Card</h2>
    
      <SwipeableCard content="👋 Swipe Me!" />
    </div>
  );
};


export default App;