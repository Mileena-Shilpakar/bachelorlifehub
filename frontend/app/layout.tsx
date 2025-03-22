import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import 'react-toastify/dist/ReactToastify.css';

import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Bachelor's LifeHub - Turn Tasks into Rewarding Adventures",
  description:
    "Bachelor's LifeHub helps you manage tasks with joy and purpose, turning productivity into a rewarding adventure."
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={"dark:bg-black"}>
      <ToastContainer position="top-right" autoClose={3000} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'
import { ToastContainer } from "react-toastify";
