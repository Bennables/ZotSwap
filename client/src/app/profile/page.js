'use client';
<<<<<<< HEAD
import dynamic from 'next/dynamic';

/* Dynamically import so it only runs client-side (avoids SSR fetch errors) */
const ProfileViewer = dynamic(() => import('../components/SignUp'), {
  ssr: false,
});
=======
import PersonalProfile from '../components/PersonalProfile';
>>>>>>> main

export default function ProfilePage() {
  return <PersonalProfile />;
}
