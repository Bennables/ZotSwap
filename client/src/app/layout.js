import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from './context/authContext'  // <-- import your AuthProvider

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Zot Swap - UCI Skill Exchange Platform',
  description: 'Connect with UCI students to exchange skills and make friends',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <AuthProvider>  {/* <-- Wrap your app here */}
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
