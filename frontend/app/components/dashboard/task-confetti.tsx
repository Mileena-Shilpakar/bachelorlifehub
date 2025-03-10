"use client"

import { useEffect, useState } from "react"

export function TaskConfetti() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Cleanup confetti elements when component unmounts
    return () => {
      document.querySelectorAll(".confetti").forEach((el) => el.remove())
    }
  }, [])

  if (!mounted) return null

  return (
    <>
      <div className="confetti rounded-md animate-confetti-slow"></div>
      <div className="confetti rounded-full animate-confetti-medium"></div>
      <div className="confetti rounded-md animate-confetti-fast"></div>
      <div className="confetti rounded-full animate-confetti-slow"></div>
      <div className="confetti rounded-md animate-confetti-medium"></div>
      <div className="confetti rounded-full animate-confetti-fast"></div>
      <div className="confetti rounded-md animate-confetti-slow"></div>
      <div className="confetti rounded-full animate-confetti-medium"></div>
      <div className="confetti rounded-md animate-confetti-fast"></div>
    </>
  )
}

