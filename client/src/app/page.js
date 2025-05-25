'use client';
<<<<<<< HEAD
import Image from 'next/image'
import styles from './page.module.css'
import Link from "next/link"


=======

import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import ProfileViewer from './components/ProfileViewer';
import SignUp from './components/SignUp'
>>>>>>> main

export default function Home() {
  // const router = useRouter();
  return (
<<<<<<< HEAD
    
    <main className="container">
      {/* header button container divider register */}
      <div className = "container">
        <br/>
      <h2 className = "zotswap-header" >Zotswap</h2>

      <h3>Sign In</h3>
      <button className = 'button'>Sign in with UCINETID</button>
      <button className = 'button'>Sign in with Google</button>
      <button className = 'button'>Sign in with Apple</button>
      <br/> 
      <h3 className = "divider">Don't have an account?</h3>

      <Link href="/swipe">TO THE PROGRAM</Link>
      {/* <button className = 'button' onClick={Register}</button> */}
      </div>
    </main>

  )
=======
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      {/* Navigation Header */}
      <nav className="p-4 bg-white shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            ZotSwap
          </Link>
          <div className="space-x-4">
            <Link href="/profile" className="text-gray-600 hover:text-blue-600">
              Profile
            </Link>
            <Link href="/auth/login" className="text-gray-600 hover:text-blue-600">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto py-20 px-4">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Welcome to ZotSwap
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect with UCI students, share skills, and make new friends
          </p>
          <Link 
            href="/auth/signup" 
            className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Learn New Skills</h2>
            <p className="text-gray-600">
              Discover and learn new skills from fellow UCI students
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Share Your Expertise</h2>
            <p className="text-gray-600">
              Teach others and develop your teaching abilities
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Build Connections</h2>
            <p className="text-gray-600">
              Meet new people and grow your UCI network
            </p>
          </div>
        </div>
      </div>
    </main>
  );
>>>>>>> main
}


// const App = () => {
//   return(
//     <div>

//       <h1>HELOO</h1>
//     </div>
//   )
// }
