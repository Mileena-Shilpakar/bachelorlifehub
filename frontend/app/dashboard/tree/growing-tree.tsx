"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

interface GrowingTreeProps {
  level: number;
  maxLevel?: number;
  colors?: {
    trunk: string;
    branches: string;
    leaves: string;
    background?: string;
  };
  animationSpeed?: number;
}

export default function GrowingTree({
  level,
  maxLevel = 100,
  colors = {
    trunk: "#8B4513",
    branches: "#A0522D",
    leaves: "#228B22",
    background: "transparent",
  },
  animationSpeed = 1,
}: GrowingTreeProps) {
  const [animatedLevel, setAnimatedLevel] = useState(1);
  const normalizedLevel = Math.min(Math.max(level, 1), maxLevel);
  const progress = (normalizedLevel / maxLevel) * 100;

  // Animate the level change
  useEffect(() => {
    if (animatedLevel === normalizedLevel) return;

    const direction = animatedLevel < normalizedLevel ? 1 : -1;
    const timer = setTimeout(() => {
      setAnimatedLevel((prev) => prev + direction);
    }, 50 / animationSpeed);

    return () => clearTimeout(timer);
  }, [animatedLevel, normalizedLevel, animationSpeed]);

  // Calculate growth factors based on current level
  const trunkHeight = calculateGrowthFactor(animatedLevel, maxLevel, 5, 70);
  const trunkWidth = calculateGrowthFactor(animatedLevel, maxLevel, 3, 15);
  const branchSize = calculateGrowthFactor(animatedLevel, maxLevel, 0, 100, 20);
  const leafDensity = calculateGrowthFactor(
    animatedLevel,
    maxLevel,
    0,
    100,
    15
  );

  // Growth stage descriptions
  const getGrowthStage = () => {
    if (animatedLevel < 5) return "Seed";
    if (animatedLevel < 20) return "Sprout";
    if (animatedLevel < 50) return "Sapling";
    if (animatedLevel < 80) return "Young Tree";
    return "Mature Tree";
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full  m-10 max-w-md mx-auto p-4">
      <div className="text-center">
        <h3 className="text-xl font-semibold">Level {animatedLevel}</h3>
        <p className="text-sm text-muted-foreground">{getGrowthStage()}</p>
      </div>

      <div
        className="relative w-full aspect-square rounded-lg flex items-end justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          style={{
            transition: `all ${0.5 / animationSpeed}s ease-in-out`,
          }}
        >
          {/* Ground */}
          <ellipse
            cx="50"
            cy="95"
            rx="40"
            ry="5"
            fill="#8B4513"
            opacity="0.3"
          />

          {/* Trunk */}
          <rect
            x={50 - trunkWidth / 2}
            y={95 - trunkHeight}
            width={trunkWidth}
            height={trunkHeight}
            fill={colors.trunk}
            rx={trunkWidth / 4}
            style={{
              transition: `all ${0.5 / animationSpeed}s ease-in-out`,
            }}
          />

          {/* Branches - only appear after level 20 */}
          {animatedLevel >= 20 && (
            <>
              {/* Left branch */}
              <path
                d={`M${50} ${95 - trunkHeight * 0.6} 
                    Q${40 - branchSize * 0.2} ${
                  95 - trunkHeight * 0.7 - branchSize * 0.15
                } 
                     ${35 - branchSize * 0.3} ${
                  95 - trunkHeight * 0.75 - branchSize * 0.25
                }`}
                stroke={colors.branches}
                strokeWidth={trunkWidth * 0.6}
                fill="none"
                style={{
                  transition: `all ${0.5 / animationSpeed}s ease-in-out`,
                }}
              />

              {/* Right branch */}
              <path
                d={`M${50} ${95 - trunkHeight * 0.7} 
                    Q${60 + branchSize * 0.2} ${
                  95 - trunkHeight * 0.8 - branchSize * 0.15
                } 
                     ${65 + branchSize * 0.3} ${
                  95 - trunkHeight * 0.85 - branchSize * 0.25
                }`}
                stroke={colors.branches}
                strokeWidth={trunkWidth * 0.6}
                fill="none"
                style={{
                  transition: `all ${0.5 / animationSpeed}s ease-in-out`,
                }}
              />

              {/* Top branch */}
              <path
                d={`M${50} ${95 - trunkHeight} 
                    Q${50} ${95 - trunkHeight - branchSize * 0.3} 
                     ${50} ${95 - trunkHeight - branchSize * 0.4}`}
                stroke={colors.branches}
                strokeWidth={trunkWidth * 0.8}
                fill="none"
                style={{
                  transition: `all ${0.5 / animationSpeed}s ease-in-out`,
                }}
              />
            </>
          )}

          {/* Leaves - only appear after level 15 */}
          {animatedLevel >= 15 && (
            <>
              {/* Top leaves */}
              <ellipse
                cx="50"
                cy={95 - trunkHeight - branchSize * 0.4}
                rx={10 + leafDensity * 0.25}
                ry={8 + leafDensity * 0.2}
                fill={colors.leaves}
                style={{
                  transition: `all ${0.5 / animationSpeed}s ease-in-out`,
                  opacity: Math.min(1, leafDensity / 30),
                }}
              />

              {/* Left leaves */}
              {animatedLevel >= 25 && (
                <ellipse
                  cx={35 - branchSize * 0.3}
                  cy={95 - trunkHeight * 0.75 - branchSize * 0.25}
                  rx={5 + leafDensity * 0.15}
                  ry={4 + leafDensity * 0.12}
                  fill={colors.leaves}
                  style={{
                    transition: `all ${0.5 / animationSpeed}s ease-in-out`,
                    opacity: Math.min(1, leafDensity / 40),
                  }}
                />
              )}

              {/* Right leaves */}
              {animatedLevel >= 30 && (
                <ellipse
                  cx={65 + branchSize * 0.3}
                  cy={95 - trunkHeight * 0.85 - branchSize * 0.25}
                  rx={6 + leafDensity * 0.18}
                  ry={5 + leafDensity * 0.15}
                  fill={colors.leaves}
                  style={{
                    transition: `all ${0.5 / animationSpeed}s ease-in-out`,
                    opacity: Math.min(1, leafDensity / 40),
                  }}
                />
              )}

              {/* Additional leaves for fuller tree at higher levels */}
              {animatedLevel >= 60 && (
                <>
                  <ellipse
                    cx={45}
                    cy={95 - trunkHeight * 0.9}
                    rx={12 + leafDensity * 0.2}
                    ry={10 + leafDensity * 0.18}
                    fill={colors.leaves}
                    style={{
                      transition: `all ${0.5 / animationSpeed}s ease-in-out`,
                      opacity: Math.min(1, (leafDensity - 40) / 60),
                    }}
                  />
                  <ellipse
                    cx={55}
                    cy={95 - trunkHeight * 0.85}
                    rx={14 + leafDensity * 0.22}
                    ry={12 + leafDensity * 0.2}
                    fill={colors.leaves}
                    style={{
                      transition: `all ${0.5 / animationSpeed}s ease-in-out`,
                      opacity: Math.min(1, (leafDensity - 40) / 60),
                    }}
                  />
                </>
              )}

              {/* Full canopy for mature tree */}
              {animatedLevel >= 80 && (
                <ellipse
                  cx={50}
                  cy={95 - trunkHeight * 0.8}
                  rx={25 + (leafDensity - 80) * 0.5}
                  ry={20 + (leafDensity - 80) * 0.4}
                  fill={colors.leaves}
                  style={{
                    transition: `all ${0.5 / animationSpeed}s ease-in-out`,
                    opacity: Math.min(0.8, (leafDensity - 80) / 20),
                  }}
                />
              )}
            </>
          )}
        </svg>
      </div>

      <div className="w-full space-y-2">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Level 1</span>
          <span>Level {maxLevel}</span>
        </div>
      </div>
    </div>
  );
}

// Helper function to calculate growth factors based on current level
function calculateGrowthFactor(
  currentLevel: number,
  maxLevel: number,
  minValue: number,
  maxValue: number,
  startLevel = 1
): number {
  if (currentLevel < startLevel) return minValue;

  const levelRange = maxLevel - startLevel;
  const normalizedLevel = Math.min(currentLevel - startLevel, levelRange);
  const growthPercentage = normalizedLevel / levelRange;

  return minValue + growthPercentage * (maxValue - minValue);
}
