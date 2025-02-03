"use client"

import { useEffect } from "react"
import Link from "next/link"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function CTASection() {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section className="py-12 md:py-20 bg-logan/10">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="container px-4 md:px-6"
      >
        <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
          <motion.div variants={itemVariants} className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-shuttle-gray md:text-4xl dark:text-white">
              Ready to Transform Your Productivity?
            </h2>
            <p className="text-lg text-manatee max-w-3xl mx-auto dark:text-[#dcdfe5]">
              Join Bachelor's LifeHub today and turn your daily tasks into rewarding adventures.
            </p>
          </motion.div>
        
        </div>
      </motion.div>
    </section>
  )
}

