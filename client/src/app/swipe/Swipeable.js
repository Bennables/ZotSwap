import { useSwipeable } from 'react-swipeable';
import { useState, useRef } from 'react';
import {animate} from 'motion';
import { useRouter} from 'next/navigation'
import "./styles.css"

const SwipeableCard = () => {
  const [swipeDir, setSwipeDir] = useState('');
  const router = useRouter();

  const handlers = useSwipeable({
    onSwipedLeft: (swipeEventData) => {
        setSwipeDir("Swiped Left");
        if(swipeEventData.event.target){
            animate(swipeEventData.event.target, { opacity: 0.1, x: -450}, { duration: 0.5 }).finished.then(() => {
            window.location.reload(); // 👈 replace with actual path
        });
        }
    },
    onSwipedRight: (swipeEventData) => {
        setSwipeDir('Swiped Right');
        if(swipeEventData.event.target){
            animate(swipeEventData.event.target, { opacity: 0.1, x: 450}, { duration: 0.5 }).finished.then(() => {
            window.location.reload(); // 👈 replace with actual path
        });
        }

    },
    preventScrollOnSwipe: true,
    trackMouse: true // allows testing on desktop
  });

  return (
    <div {...handlers} className = 'box'>
      <h3>{swipeDir || 'Swipe me!'}</h3>
    </div>
  );
};



export default SwipeableCard;
