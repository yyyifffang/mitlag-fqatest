import { Inter } from "next/font/google"
import "./globals.scss"
import Navbar from "@/components/Navbar/Navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "MIT Lab - 資訊技術行動化實驗室",
  description: "MIT Lab 國立臺灣科技大學 資訊技術行動化實驗室",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <body className={inter.className}>
        <Navbar/>
        {children}
      </body>
    </html>
  )
}
