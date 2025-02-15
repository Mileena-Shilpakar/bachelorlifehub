// app/components/LottieAnimation.tsx
"use client";  // Marking this file as a client component

import Lottie from "lottie-react";
import animationData from "../public/assets/Animation - 1741453190643.json"; // Path to your animation file

export default function LottieAnimation() {
  return <Lottie animationData={animationData} loop={true} />;
}
