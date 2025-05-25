import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
<<<<<<< HEAD
  title: 'SkillSwap',
  description: 'The Learning Marketplace',
=======
  title: 'Zot Swap - UCI Skill Exchange Platform',
  description: 'Connect with UCI students to exchange skills and make friends',
>>>>>>> main
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
