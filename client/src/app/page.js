import Image from 'next/image'
import styles from './page.module.css'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold text-red-500">
        Tailwind on! 🚀
      </h1>

      <Link href = "/matched">CLICK</Link>
    </main>
  )
}
