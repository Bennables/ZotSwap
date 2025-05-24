'use client';

import Image from 'next/image';
import styles from './page.module.css';
import ProfileViewer from './components/ProfileViewer';
import SignUp from './components/SignUp'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className="w-full flex justify-center my-10">
        <ProfileViewer />
      </div>
    </main>
  );
}
