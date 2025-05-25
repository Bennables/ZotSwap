import dynamic from 'next/dynamic';

/* Dynamically import so it only runs client-side (avoids SSR fetch errors) */
const ProfileViewer = dynamic(() => import('../components/SignUp'), {
  ssr: false,
});

export default function ProfilePage() {
  return <ProfileViewer />;
}
