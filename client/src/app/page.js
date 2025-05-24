'use client';
import Image from 'next/image'
import styles from './page.module.css'
import Link from "next/link"



export default function Home() {
  // const router = useRouter();
  return (
    
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
}


// const App = () => {
//   return(
//     <div>

//       <h1>HELOO</h1>
//     </div>
//   )
// }
