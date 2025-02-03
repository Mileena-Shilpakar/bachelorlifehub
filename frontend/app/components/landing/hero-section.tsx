"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"

export function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative overflow-hidden bg-athens-gray py-12 md:py-20">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-logan/10 animate-pulse"></div>
        <div
          className="absolute bottom-40 right-10 w-32 h-32 rounded-full bg-botticelli/20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-logan/10 animate-pulse"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <motion.div
            className="flex flex-col px-14 justify-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-2">
              <motion.h1
                className="text-3xl font-bold tracking-tighter text-shuttle-gray dark:text-white sm:text-4xl md:text-5xl lg:text-6xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Manage Tasks with <span className="text-logan">Joy</span> and{" "}
                <span className="text-logan">Purpose</span>
              </motion.h1>
              <motion.p
                className="max-w-[600px] text-manatee dark:text-[#DCDFE5] md:text-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Bachelor's LifeHub turns your daily tasks into rewarding adventures. Stay organized, track progress, and earn
                rewards as you accomplish your goals.
              </motion.p>
            </div>
            <motion.div
              className="flex flex-col gap-2 min-[400px]:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Button asChild size="lg" variant="default" className="dark:bg-[#BB86FC] dark:text-white">
                <Link href="/login">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="link">
                <Link href="#features" className="dark:text-gray-500">Learn More</Link>
              </Button>
            </motion.div>
            <motion.div
              className="flex items-center space-x-4 text-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <div className="flex items-center space-x-1">
                <CheckCircle2 className="h-4 w-4 text-logan" />
                <span className="text-manatee">Kanban Board</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle2 className="h-4 w-4 text-logan" />
                <span className="text-manatee">Calendar View</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle2 className="h-4 w-4 text-logan" />
                <span className="text-manatee">Rewards System</span>
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="relative w-full max-w-[500px] aspect-square">
              <div className="absolute inset-0 rounded-full bg-logan/10 animate-pulse"></div>
              <div className="relative z-10 w-full h-full p-4">
                <div className="relative w-full h-full overflow-hidden rounded-xl border-2 border-logan/20 dark:border-black bg-transparent shadow-xl">
                  <Image
                    src="/main.jpeg?height=600&width=600"
                    alt="Bachelor's LifeHub Dashboard Preview"
                    width={600}
                    height={600}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </div>
              <motion.div
                className="absolute -top-4 -right-4 w-24 h-24 rotate-12"
                animate={{ rotate: [12, -5, 12] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 5, ease: "easeInOut" }}
              >
                <Image
                  src="/main.jpeg?height=100&width=100"
                  alt="Sticker"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </motion.div>
              <motion.div
                className="absolute -bottom-6 -left-6 w-20 h-20 -rotate-12"
                animate={{ rotate: [-12, 5, -12] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 4, ease: "easeInOut" }}
              >
                <Image
                  src="/main.jpeg?height=80&width=80"
                  alt="Sticker"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

