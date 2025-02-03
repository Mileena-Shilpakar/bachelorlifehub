"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Calendar, Clock, Flame, Kanban, Mail, Trophy } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: Kanban,
    title: "Kanban Board",
    description:
      "Visualize your workflow with a drag-and-drop Kanban board to manage tasks efficiently.",
  },
  {
    icon: Calendar,
    title: "Calendar View",
    description:
      "Plan your schedule with an interactive calendar that displays all your upcoming tasks.",
  },
  {
    icon: Clock,
    title: "Task Timer",
    description:
      "Track time spent on tasks and monitor your productivity with built-in timers.",
  },
  {
    icon: Trophy,
    title: "Gamification",
    description:
      "Earn points, unlock achievements, and level up as you complete tasks and reach milestones.",
  },
  {
    icon: Mail,
    title: "Email Reminders",
    description:
      "Never miss a deadline with automated email reminders for upcoming tasks.",
  },
  {
    icon: Flame,
    title: "Streak System",
    description:
      "Stay on top of your game! Build streaks by completing tasks daily, unlock exclusive badges, and challenge yourself to keep the momentum going.",
  },
];

export function FeaturesSection() {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="features" className="py-12 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-shuttle-gray md:text-4xl dark:text-white">
            Powerful Features for Productive Work
          </h2>
          <p className="mt-4 text-lg text-manatee max-w-3xl mx-auto dark:text-[#dcdfe5]">
            Bachelor's LifeHub combines powerful task management tools with fun
            gamification elements to keep you motivated and productive.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
      <Card className="overflow-hidden border bg-gray-50 dark:border-gray-800 dark:bg-[#1D1D1D] shadow-sm">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-logan/10 flex items-center justify-center mb-2">
                    <feature.icon className="h-6 w-6 text-logan dark:text-[#dcdfe5]" />
                  </div>
                  <CardTitle className="text-xl text-shuttle-gray dark:text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-manatee text-base dark:text-gray-500">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
