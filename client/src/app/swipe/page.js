'use client';
import './styles.css'
// import {ProfileViewer} from '../components/ProfileViewer'

import { animate } from "motion"
// App.js or page.js
import SwipeableCard from './Swipeable';

const App = () => {
  return (
    <main>
        <div>
            <h2>Swipe the Card</h2>
        </div>

        <SwipeableCard content="" />

    </main>
  );
};


export default App;