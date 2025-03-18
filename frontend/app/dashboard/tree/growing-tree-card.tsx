"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, CloudRain, Sun, Wind } from "lucide-react";

type WeatherType = "sunny" | "cloudy" | "rainy" | "windy";

interface GrowingTreeCardProps {
  level: number;
  maxLevel?: number;
  title?: string;
  weather?: WeatherType;
  colors?: {
    trunk: string;
    branches: string;
    leaves: string;
    soil: string;
    background?: string;
  };
  animationSpeed?: number;
  className?: string;
}

export default function GrowingTreeCard({
  level,
  maxLevel = 100,
  title = "Growing Tree",
  weather = "sunny",
  colors = {
    trunk: "#8B4513",
    branches: "#A0522D",
    leaves: "#228B22",
    soil: "#5D4037",
    background: "transparent",
  },
  animationSpeed = 1,
  className = "",
}: GrowingTreeCardProps) {
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
  const seedSize = calculateGrowthFactor(animatedLevel, maxLevel, 2, 0, 0, 10);
  const rootSize = calculateGrowthFactor(animatedLevel, maxLevel, 0, 20, 0, 15);
  const trunkHeight = calculateGrowthFactor(
    animatedLevel,
    maxLevel,
    0,
    70,
    5,
    100
  );
  const trunkWidth = calculateGrowthFactor(
    animatedLevel,
    maxLevel,
    0,
    15,
    5,
    100
  );
  const branchSize = calculateGrowthFactor(
    animatedLevel,
    maxLevel,
    0,
    100,
    20,
    100
  );
  const leafDensity = calculateGrowthFactor(
    animatedLevel,
    maxLevel,
    0,
    100,
    15,
    100
  );

  // Derive leaf colors for variation
  const leafColorBase = colors.leaves;
  const leafColorDark = adjustColor(leafColorBase, -20);
  const leafColorLight = adjustColor(leafColorBase, 20);

  // Growth stage descriptions
  const getGrowthStage = () => {
    if (animatedLevel < 5) return "Seed";
    if (animatedLevel < 20) return "Sprout";
    if (animatedLevel < 50) return "Sapling";
    if (animatedLevel < 80) return "Young Tree";
    return "Mature Tree";
  };

  // Weather icon
  const getWeatherIcon = () => {
    switch (weather) {
      case "sunny":
        return <Sun className="h-6 w-6 text-yellow-500" />;
      case "cloudy":
        return <Cloud className="h-6 w-6 text-gray-400" />;
      case "rainy":
        return <CloudRain className="h-6 w-6 text-blue-400" />;
      case "windy":
        return <Wind className="h-6 w-6 text-cyan-500" />;
    }
  };

  return (
        <Card className="overflow-hidden border bg-gray-50 dark:border-gray-800 dark:bg-[#1D1D1D] shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-medium dark:text-[#D1D5DB]">{title}</CardTitle>
        <div className="flex items-center gap-2">
          {getWeatherIcon()}
          <span className="text-sm text-muted-foreground capitalize">
            {weather}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-lg font-semibold dark:text-[#D1D5DB]">
                Level {animatedLevel}
              </span>
              <p className="text-sm text-muted-foreground dark:text-gray-500">
                {getGrowthStage()}
              </p>
            </div>
            <Progress value={progress} className="w-1/2 h-2 dark:bg-[#BB86FC]" />
          </div>
        </div>

        <div
          className="relative w-full aspect-square rounded-lg overflow-hidden"
          style={{ backgroundColor: colors.background }}
        >
          {/* Weather Effects */}
          {weather === "rainy" && <RainEffect />}
          {weather === "windy" && <WindEffect />}

          <svg
            viewBox="0 0 100 120"
            className="w-full h-full"
            style={{
              transition: `all ${0.5 / animationSpeed}s ease-in-out`,
            }}
          >
            {/* Sky */}
            {weather === "sunny" && (
              <circle cx="80" cy="20" r="10" fill="#FFD700" opacity="0.8">
                <animate
                  attributeName="opacity"
                  values="0.7;0.9;0.7"
                  dur="5s"
                  repeatCount="indefinite"
                />
              </circle>
            )}

            {weather === "cloudy" && (
              <>
                <path
                  d="M30,25 Q40,20 50,25 Q60,30 70,25 Q75,20 80,25 Q70,35 60,30 Q50,35 40,30 Q35,35 30,25"
                  fill="#E0E0E0"
                  opacity="0.8"
                />
                <path
                  d="M60,15 Q70,10 80,15 Q90,20 85,25 Q75,30 65,25 Q60,30 60,15"
                  fill="#E0E0E0"
                  opacity="0.7"
                />
              </>
            )}

            {/* Soil */}
            <rect x="0" y="95" width="100" height="25" fill={colors.soil} />
            <path
              d="M0,95 Q25,92 50,95 Q75,98 100,95 L100,100 L0,100 Z"
              fill={colors.soil}
              opacity="0.7"
            />

            {/* Underground seed and roots - only visible in early stages */}
            {animatedLevel < 15 && (
              <>
                {/* Seed */}
                {animatedLevel < 10 && (
                  <ellipse
                    cx="50"
                    cy="105"
                    rx={seedSize}
                    ry={seedSize * 1.5}
                    fill="#F5DEB3"
                    style={{
                      transition: `all ${0.5 / animationSpeed}s ease-in-out`,
                    }}
                  />
                )}

                {/* Initial roots */}
                {animatedLevel >= 2 && (
                  <>
                    <path
                      d={`M50,${105 + seedSize} 
                          Q45,${110 + rootSize * 0.3} 40,${
                        115 + rootSize * 0.5
                      }`}
                      stroke="#8B4513"
                      strokeWidth={1 + rootSize * 0.1}
                      fill="none"
                      style={{
                        transition: `all ${0.5 / animationSpeed}s ease-in-out`,
                      }}
                    />
                    <path
                      d={`M50,${105 + seedSize} 
                          Q55,${110 + rootSize * 0.3} 60,${
                        115 + rootSize * 0.5
                      }`}
                      stroke="#8B4513"
                      strokeWidth={1 + rootSize * 0.1}
                      fill="none"
                      style={{
                        transition: `all ${0.5 / animationSpeed}s ease-in-out`,
                      }}
                    />
                    <path
                      d={`M50,${105 + seedSize} 
                          Q50,${110 + rootSize * 0.3} 50,${
                        115 + rootSize * 0.5
                      }`}
                      stroke="#8B4513"
                      strokeWidth={1 + rootSize * 0.1}
                      fill="none"
                      style={{
                        transition: `all ${0.5 / animationSpeed}s ease-in-out`,
                      }}
                    />
                  </>
                )}
              </>
            )}

            {/* Ground */}
            <path
              d="M0,95 Q25,93 50,95 Q75,97 100,95"
              stroke="#3E2723"
              strokeWidth="1"
              fill="none"
            />

            {/* Tree Structure - Realistic Tree */}
            {animatedLevel >= 5 && (
              <g>
                {/* Main Trunk */}
                <path
                  d={`M${50 - trunkWidth * 0.4},95 
                      C${50 - trunkWidth * 0.5},${95 - trunkHeight * 0.3} 
                       ${50 - trunkWidth * 0.3},${95 - trunkHeight * 0.6} 
                       ${50},${95 - trunkHeight * 0.9}
                      C${50 + trunkWidth * 0.3},${95 - trunkHeight * 0.6} 
                       ${50 + trunkWidth * 0.5},${95 - trunkHeight * 0.3} 
                       ${50 + trunkWidth * 0.4},95`}
                  fill={colors.trunk}
                  style={{
                    transition: `all ${0.5 / animationSpeed}s ease-in-out`,
                  }}
                />

                {/* Trunk Texture */}
                {animatedLevel >= 30 && (
                  <>
                    <path
                      d={`M${50 - trunkWidth * 0.2},95 
                          C${50 - trunkWidth * 0.25},${95 - trunkHeight * 0.4} 
                           ${50 - trunkWidth * 0.15},${95 - trunkHeight * 0.7} 
                           ${50 - trunkWidth * 0.05},${95 - trunkHeight * 0.9}`}
                      stroke={adjustColor(colors.trunk, -20)}
                      strokeWidth="0.5"
                      fill="none"
                      opacity="0.7"
                      style={{
                        transition: `all ${0.5 / animationSpeed}s ease-in-out`,
                      }}
                    />
                    <path
                      d={`M${50 + trunkWidth * 0.2},95 
                          C${50 + trunkWidth * 0.25},${95 - trunkHeight * 0.4} 
                           ${50 + trunkWidth * 0.15},${95 - trunkHeight * 0.7} 
                           ${50 + trunkWidth * 0.05},${95 - trunkHeight * 0.9}`}
                      stroke={adjustColor(colors.trunk, -20)}
                      strokeWidth="0.5"
                      fill="none"
                      opacity="0.7"
                      style={{
                        transition: `all ${0.5 / animationSpeed}s ease-in-out`,
                      }}
                    />
                  </>
                )}

                {/* Branches - only appear after level 20 */}
                {animatedLevel >= 20 && (
                  <>
                    {/* Primary branches */}
                    <g
                      style={{
                        transition: `all ${0.5 / animationSpeed}s ease-in-out`,
                      }}
                    >
                      {/* Main left branch */}
                      <path
                        d={`M${50 - trunkWidth * 0.1} ${95 - trunkHeight * 0.6} 
                            C${45 - branchSize * 0.15} ${
                          95 - trunkHeight * 0.65 - branchSize * 0.1
                        } 
                             ${40 - branchSize * 0.25} ${
                          95 - trunkHeight * 0.7 - branchSize * 0.15
                        } 
                             ${35 - branchSize * 0.3} ${
                          95 - trunkHeight * 0.75 - branchSize * 0.25
                        }`}
                        stroke={colors.branches}
                        strokeWidth={trunkWidth * 0.5}
                        fill="none"
                      />

                      {/* Main right branch */}
                      <path
                        d={`M${50 + trunkWidth * 0.1} ${95 - trunkHeight * 0.7} 
                            C${55 + branchSize * 0.15} ${
                          95 - trunkHeight * 0.75 - branchSize * 0.1
                        } 
                             ${60 + branchSize * 0.25} ${
                          95 - trunkHeight * 0.8 - branchSize * 0.15
                        } 
                             ${65 + branchSize * 0.3} ${
                          95 - trunkHeight * 0.85 - branchSize * 0.25
                        }`}
                        stroke={colors.branches}
                        strokeWidth={trunkWidth * 0.5}
                        fill="none"
                      />

                      {/* Upper trunk extension */}
                      <path
                        d={`M${50} ${95 - trunkHeight * 0.9} 
                            C${50 - trunkWidth * 0.05} ${
                          95 - trunkHeight * 0.95
                        } 
                             ${50} ${95 - trunkHeight} 
                             ${50} ${95 - trunkHeight - branchSize * 0.1}`}
                        stroke={colors.branches}
                        strokeWidth={trunkWidth * 0.4}
                        fill="none"
                      />
                    </g>

                    {/* Secondary branches - appear at higher levels */}
                    {animatedLevel >= 35 && (
                      <g
                        style={{
                          transition: `all ${
                            0.5 / animationSpeed
                          }s ease-in-out`,
                        }}
                      >
                        {/* Secondary left branches */}
                        <path
                          d={`M${50 - trunkWidth * 0.1} ${
                            95 - trunkHeight * 0.4
                          } 
                              C${42 - branchSize * 0.1} ${
                            95 - trunkHeight * 0.45 - branchSize * 0.05
                          } 
                               ${38 - branchSize * 0.15} ${
                            95 - trunkHeight * 0.5 - branchSize * 0.1
                          } 
                               ${36 - branchSize * 0.2} ${
                            95 - trunkHeight * 0.55 - branchSize * 0.15
                          }`}
                          stroke={colors.branches}
                          strokeWidth={trunkWidth * 0.4}
                          fill="none"
                        />

                        {/* Secondary right branches */}
                        <path
                          d={`M${50 + trunkWidth * 0.1} ${
                            95 - trunkHeight * 0.5
                          } 
                              C${58 + branchSize * 0.1} ${
                            95 - trunkHeight * 0.55 - branchSize * 0.05
                          } 
                               ${62 + branchSize * 0.15} ${
                            95 - trunkHeight * 0.6 - branchSize * 0.1
                          } 
                               ${64 + branchSize * 0.2} ${
                            95 - trunkHeight * 0.65 - branchSize * 0.15
                          }`}
                          stroke={colors.branches}
                          strokeWidth={trunkWidth * 0.4}
                          fill="none"
                        />
                      </g>
                    )}

                    {/* Tertiary branches - appear at higher levels */}
                    {animatedLevel >= 50 && (
                      <g
                        style={{
                          transition: `all ${
                            0.5 / animationSpeed
                          }s ease-in-out`,
                        }}
                      >
                        {/* Small branches from main left branch */}
                        <path
                          d={`M${40 - branchSize * 0.15} ${
                            95 - trunkHeight * 0.7 - branchSize * 0.1
                          } 
                              C${38 - branchSize * 0.2} ${
                            95 - trunkHeight * 0.75 - branchSize * 0.15
                          } 
                               ${36 - branchSize * 0.25} ${
                            95 - trunkHeight * 0.78 - branchSize * 0.2
                          } 
                               ${34 - branchSize * 0.28} ${
                            95 - trunkHeight * 0.8 - branchSize * 0.25
                          }`}
                          stroke={colors.branches}
                          strokeWidth={trunkWidth * 0.25}
                          fill="none"
                        />

                        <path
                          d={`M${38 - branchSize * 0.2} ${
                            95 - trunkHeight * 0.72 - branchSize * 0.18
                          } 
                              C${36 - branchSize * 0.22} ${
                            95 - trunkHeight * 0.74 - branchSize * 0.2
                          } 
                               ${35 - branchSize * 0.24} ${
                            95 - trunkHeight * 0.76 - branchSize * 0.22
                          } 
                               ${34 - branchSize * 0.26} ${
                            95 - trunkHeight * 0.78 - branchSize * 0.24
                          }`}
                          stroke={colors.branches}
                          strokeWidth={trunkWidth * 0.2}
                          fill="none"
                        />

                        {/* Small branches from main right branch */}
                        <path
                          d={`M${60 + branchSize * 0.15} ${
                            95 - trunkHeight * 0.8 - branchSize * 0.1
                          } 
                              C${62 + branchSize * 0.2} ${
                            95 - trunkHeight * 0.82 - branchSize * 0.15
                          } 
                               ${64 + branchSize * 0.25} ${
                            95 - trunkHeight * 0.84 - branchSize * 0.2
                          } 
                               ${66 + branchSize * 0.28} ${
                            95 - trunkHeight * 0.86 - branchSize * 0.25
                          }`}
                          stroke={colors.branches}
                          strokeWidth={trunkWidth * 0.25}
                          fill="none"
                        />

                        <path
                          d={`M${62 + branchSize * 0.2} ${
                            95 - trunkHeight * 0.81 - branchSize * 0.18
                          } 
                              C${64 + branchSize * 0.22} ${
                            95 - trunkHeight * 0.83 - branchSize * 0.2
                          } 
                               ${65 + branchSize * 0.24} ${
                            95 - trunkHeight * 0.85 - branchSize * 0.22
                          } 
                               ${66 + branchSize * 0.26} ${
                            95 - trunkHeight * 0.87 - branchSize * 0.24
                          }`}
                          stroke={colors.branches}
                          strokeWidth={trunkWidth * 0.2}
                          fill="none"
                        />

                        {/* Small branches from top */}
                        <path
                          d={`M${50 - trunkWidth * 0.1} ${
                            95 - trunkHeight - branchSize * 0.05
                          } 
                              C${48 - branchSize * 0.1} ${
                            95 - trunkHeight - branchSize * 0.15
                          } 
                               ${46 - branchSize * 0.15} ${
                            95 - trunkHeight - branchSize * 0.2
                          } 
                               ${44 - branchSize * 0.2} ${
                            95 - trunkHeight - branchSize * 0.25
                          }`}
                          stroke={colors.branches}
                          strokeWidth={trunkWidth * 0.3}
                          fill="none"
                        />

                        <path
                          d={`M${50 + trunkWidth * 0.1} ${
                            95 - trunkHeight - branchSize * 0.05
                          } 
                              C${52 + branchSize * 0.1} ${
                            95 - trunkHeight - branchSize * 0.15
                          } 
                               ${54 + branchSize * 0.15} ${
                            95 - trunkHeight - branchSize * 0.2
                          } 
                               ${56 + branchSize * 0.2} ${
                            95 - trunkHeight - branchSize * 0.25
                          }`}
                          stroke={colors.branches}
                          strokeWidth={trunkWidth * 0.3}
                          fill="none"
                        />
                      </g>
                    )}
                  </>
                )}

                {/* Tree Foliage - Realistic Leaf Clusters */}
                {animatedLevel >= 15 && (
                  <g>
                    {/* Top foliage */}
                    <g
                      style={{
                        opacity: Math.min(1, leafDensity / 30),
                        transition: `all ${0.5 / animationSpeed}s ease-in-out`,
                      }}
                    >
                      {weather === "windy" && (
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          from="-2 50 95"
                          to="2 50 95"
                          dur="2.5s"
                          repeatCount="indefinite"
                          additive="sum"
                        />
                      )}

                      {/* Create realistic foliage at the top */}
                      <RealTreeFoliage
                        x={50}
                        y={95 - trunkHeight - branchSize * 0.1}
                        size={10 + leafDensity * 0.25}
                        density={Math.min(1, leafDensity / 50)}
                        baseColor={leafColorBase}
                        darkColor={leafColorDark}
                        lightColor={leafColorLight}
                        weather={weather}
                      />
                    </g>

                    {/* Left branch foliage */}
                    {animatedLevel >= 25 && (
                      <g
                        style={{
                          opacity: Math.min(1, leafDensity / 40),
                          transition: `all ${
                            0.5 / animationSpeed
                          }s ease-in-out`,
                        }}
                      >
                        {weather === "windy" && (
                          <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="-3 35 95"
                            to="2 35 95"
                            dur="2.2s"
                            repeatCount="indefinite"
                            additive="sum"
                          />
                        )}

                        {/* Create realistic foliage on left branch */}
                        <RealTreeFoliage
                          x={35 - branchSize * 0.3}
                          y={95 - trunkHeight * 0.75 - branchSize * 0.25}
                          size={5 + leafDensity * 0.15}
                          density={Math.min(0.8, leafDensity / 60)}
                          baseColor={leafColorBase}
                          darkColor={leafColorDark}
                          lightColor={leafColorLight}
                          weather={weather}
                        />
                      </g>
                    )}

                    {/* Right branch foliage */}
                    {animatedLevel >= 30 && (
                      <g
                        style={{
                          opacity: Math.min(1, leafDensity / 40),
                          transition: `all ${
                            0.5 / animationSpeed
                          }s ease-in-out`,
                        }}
                      >
                        {weather === "windy" && (
                          <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="-2 65 95"
                            to="3 65 95"
                            dur="2.3s"
                            repeatCount="indefinite"
                            additive="sum"
                          />
                        )}

                        {/* Create realistic foliage on right branch */}
                        <RealTreeFoliage
                          x={65 + branchSize * 0.3}
                          y={95 - trunkHeight * 0.85 - branchSize * 0.25}
                          size={6 + leafDensity * 0.18}
                          density={Math.min(0.8, leafDensity / 60)}
                          baseColor={leafColorBase}
                          darkColor={leafColorDark}
                          lightColor={leafColorLight}
                          weather={weather}
                        />
                      </g>
                    )}

                    {/* Secondary branch foliage */}
                    {animatedLevel >= 45 && (
                      <>
                        <g
                          style={{
                            opacity: Math.min(1, (leafDensity - 30) / 70),
                            transition: `all ${
                              0.5 / animationSpeed
                            }s ease-in-out`,
                          }}
                        >
                          {weather === "windy" && (
                            <animateTransform
                              attributeName="transform"
                              type="rotate"
                              from="-2 36 95"
                              to="2 36 95"
                              dur="1.9s"
                              repeatCount="indefinite"
                              additive="sum"
                            />
                          )}

                          {/* Create realistic foliage on secondary left branch */}
                          <RealTreeFoliage
                            x={36 - branchSize * 0.2}
                            y={95 - trunkHeight * 0.55 - branchSize * 0.15}
                            size={4 + leafDensity * 0.12}
                            density={Math.min(0.7, (leafDensity - 30) / 70)}
                            baseColor={leafColorBase}
                            darkColor={leafColorDark}
                            lightColor={leafColorLight}
                            weather={weather}
                          />
                        </g>

                        <g
                          style={{
                            opacity: Math.min(1, (leafDensity - 30) / 70),
                            transition: `all ${
                              0.5 / animationSpeed
                            }s ease-in-out`,
                          }}
                        >
                          {weather === "windy" && (
                            <animateTransform
                              attributeName="transform"
                              type="rotate"
                              from="-2 64 95"
                              to="2 64 95"
                              dur="2.1s"
                              repeatCount="indefinite"
                              additive="sum"
                            />
                          )}

                          {/* Create realistic foliage on secondary right branch */}
                          <RealTreeFoliage
                            x={64 + branchSize * 0.2}
                            y={95 - trunkHeight * 0.65 - branchSize * 0.15}
                            size={4 + leafDensity * 0.12}
                            density={Math.min(0.7, (leafDensity - 30) / 70)}
                            baseColor={leafColorBase}
                            darkColor={leafColorDark}
                            lightColor={leafColorLight}
                            weather={weather}
                          />
                        </g>
                      </>
                    )}

                    {/* Additional foliage for fuller tree */}
                    {animatedLevel >= 60 && (
                      <>
                        <g
                          style={{
                            opacity: Math.min(1, (leafDensity - 40) / 60),
                            transition: `all ${
                              0.5 / animationSpeed
                            }s ease-in-out`,
                          }}
                        >
                          {weather === "windy" && (
                            <animateTransform
                              attributeName="transform"
                              type="rotate"
                              from="-2 45 95"
                              to="2 45 95"
                              dur="2.4s"
                              repeatCount="indefinite"
                              additive="sum"
                            />
                          )}

                          {/* Create realistic foliage for fuller tree */}
                          <RealTreeFoliage
                            x={45}
                            y={95 - trunkHeight * 0.9}
                            size={12 + leafDensity * 0.2}
                            density={Math.min(0.9, (leafDensity - 40) / 60)}
                            baseColor={leafColorBase}
                            darkColor={leafColorDark}
                            lightColor={leafColorLight}
                            weather={weather}
                          />
                        </g>

                        <g
                          style={{
                            opacity: Math.min(1, (leafDensity - 40) / 60),
                            transition: `all ${
                              0.5 / animationSpeed
                            }s ease-in-out`,
                          }}
                        >
                          {weather === "windy" && (
                            <animateTransform
                              attributeName="transform"
                              type="rotate"
                              from="-2 55 95"
                              to="2 55 95"
                              dur="2.2s"
                              repeatCount="indefinite"
                              additive="sum"
                            />
                          )}

                          {/* Create realistic foliage for fuller tree */}
                          <RealTreeFoliage
                            x={55}
                            y={95 - trunkHeight * 0.85}
                            size={14 + leafDensity * 0.22}
                            density={Math.min(0.9, (leafDensity - 40) / 60)}
                            baseColor={leafColorBase}
                            darkColor={leafColorDark}
                            lightColor={leafColorLight}
                            weather={weather}
                          />
                        </g>
                      </>
                    )}

                    {/* Full canopy for mature tree */}
                    {animatedLevel >= 80 && (
                      <g
                        style={{
                          opacity: Math.min(0.9, (leafDensity - 80) / 20),
                          transition: `all ${
                            0.5 / animationSpeed
                          }s ease-in-out`,
                        }}
                      >
                        {weather === "windy" && (
                          <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="-1 50 95"
                            to="1 50 95"
                            dur="2.7s"
                            repeatCount="indefinite"
                            additive="sum"
                          />
                        )}

                        {/* Create realistic full canopy */}
                        <RealTreeFoliage
                          x={50}
                          y={95 - trunkHeight * 0.8}
                          size={25 + (leafDensity - 80) * 0.5}
                          density={Math.min(1, (leafDensity - 80) / 20)}
                          baseColor={leafColorBase}
                          darkColor={leafColorDark}
                          lightColor={leafColorLight}
                          weather={weather}
                          isFullCanopy={true}
                        />
                      </g>
                    )}
                  </g>
                )}
              </g>
            )}
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}

// Realistic Tree Foliage Component
function RealTreeFoliage({
  x,
  y,
  size,
  density = 1,
  baseColor,
  darkColor,
  lightColor,
  weather,
  isFullCanopy = false,
}: any) {
  // Calculate number of leaf clusters based on size and density
  const numClusters = Math.max(3, Math.floor(size * density * 0.8));
  const clusters = [];

  // Generate main foliage shape
  const foliageShape = (
    <path
      d={`M${x},${y - size * 0.8}
          C${x - size * 0.7},${y - size * 0.6} 
           ${x - size},${y - size * 0.2} 
           ${x - size * 0.9},${y + size * 0.1}
          C${x - size * 0.7},${y + size * 0.3} 
           ${x - size * 0.3},${y + size * 0.4} 
           ${x},${y + size * 0.3}
          C${x + size * 0.3},${y + size * 0.4} 
           ${x + size * 0.7},${y + size * 0.3} 
           ${x + size * 0.9},${y + size * 0.1}
          C${x + size},${y - size * 0.2} 
           ${x + size * 0.7},${y - size * 0.6} 
           ${x},${y - size * 0.8}
          Z`}
      fill={baseColor}
      opacity="0.7"
    />
  );

  // Add the main foliage shape
  clusters.push(foliageShape);

  // Generate leaf clusters
  for (let i = 0; i < numClusters; i++) {
    // Calculate position within the foliage area
    const angle = (i / numClusters) * Math.PI * 2;
    const distanceRatio = isFullCanopy
      ? 0.2 + Math.random() * 0.8
      : 0.4 + Math.random() * 0.6;
    const clusterX = x + Math.cos(angle) * size * distanceRatio;
    const clusterY = y + Math.sin(angle) * size * 0.7 * distanceRatio;

    // Randomize cluster size
    const clusterSize = size * (0.3 + Math.random() * 0.3);

    // Choose color variation
    const colorIndex = i % 3;
    const color =
      colorIndex === 0 ? baseColor : colorIndex === 1 ? darkColor : lightColor;

    // Create leaf cluster
    clusters.push(
      <g key={`cluster-${i}`}>
        {/* Leaf cluster */}
        <path
          d={`M${clusterX},${clusterY - clusterSize * 0.5}
              C${clusterX - clusterSize * 0.5},${clusterY - clusterSize * 0.3} 
               ${clusterX - clusterSize * 0.7},${clusterY} 
               ${clusterX - clusterSize * 0.5},${clusterY + clusterSize * 0.3}
              C${clusterX - clusterSize * 0.3},${clusterY + clusterSize * 0.5} 
               ${clusterX},${clusterY + clusterSize * 0.6} 
               ${clusterX + clusterSize * 0.3},${clusterY + clusterSize * 0.5}
              C${clusterX + clusterSize * 0.5},${clusterY + clusterSize * 0.3} 
               ${clusterX + clusterSize * 0.7},${clusterY} 
               ${clusterX + clusterSize * 0.5},${clusterY - clusterSize * 0.3}
              C${clusterX + clusterSize * 0.3},${clusterY - clusterSize * 0.5} 
               ${clusterX},${clusterY - clusterSize * 0.6} 
               ${clusterX - clusterSize * 0.3},${clusterY - clusterSize * 0.5}
              Z`}
          fill={color}
          opacity={0.8 + Math.random() * 0.2}
        />

        {/* Individual leaves */}
        {Array.from({ length: Math.floor(clusterSize * 1.5) }).map((_, j) => {
          const leafAngle = Math.random() * Math.PI * 2;
          const leafDistance = clusterSize * (0.3 + Math.random() * 0.7);
          const leafX = clusterX + Math.cos(leafAngle) * leafDistance * 0.7;
          const leafY = clusterY + Math.sin(leafAngle) * leafDistance * 0.5;
          const leafSize = clusterSize * (0.15 + Math.random() * 0.15);
          const leafRotation = Math.random() * 360;

          return (
            <g
              key={`leaf-${i}-${j}`}
              transform={`translate(${leafX}, ${leafY}) rotate(${leafRotation})`}
            >
              <path
                d={`M0,0 
                    C${leafSize * 0.3},${leafSize * 0.5} ${
                  leafSize * 0.6
                },${leafSize} ${leafSize * 0.3},${leafSize * 1.5}
                    C${leafSize * 0.1},${leafSize * 1.3} -${leafSize * 0.1},${
                  leafSize * 1.3
                } -${leafSize * 0.3},${leafSize * 1.5}
                    C-${leafSize * 0.6},${leafSize} -${leafSize * 0.3},${
                  leafSize * 0.5
                } 0,0
                    Z`}
                fill={color}
                opacity={0.7 + Math.random() * 0.3}
              />

              {/* Leaf vein */}
              <path
                d={`M0,0 L0,${leafSize * 1.2}`}
                stroke={adjustColor(color, -30)}
                strokeWidth={leafSize * 0.05}
                opacity="0.5"
              />
            </g>
          );
        })}
      </g>
    );
  }

  // For full canopy, add some additional detail
  if (isFullCanopy) {
    // Add some denser clusters in the middle
    for (let i = 0; i < numClusters / 2; i++) {
      const angle = (i / (numClusters / 2)) * Math.PI * 2;
      const clusterX = x + Math.cos(angle) * size * 0.4;
      const clusterY = y + Math.sin(angle) * size * 0.3;

      const clusterSize = size * (0.4 + Math.random() * 0.2);
      const color = i % 2 === 0 ? baseColor : darkColor;

      clusters.push(
        <path
          key={`inner-cluster-${i}`}
          d={`M${clusterX},${clusterY - clusterSize * 0.5}
              C${clusterX - clusterSize * 0.6},${clusterY - clusterSize * 0.3} 
               ${clusterX - clusterSize * 0.8},${clusterY} 
               ${clusterX - clusterSize * 0.6},${clusterY + clusterSize * 0.3}
              C${clusterX - clusterSize * 0.3},${clusterY + clusterSize * 0.6} 
               ${clusterX},${clusterY + clusterSize * 0.7} 
               ${clusterX + clusterSize * 0.3},${clusterY + clusterSize * 0.6}
              C${clusterX + clusterSize * 0.6},${clusterY + clusterSize * 0.3} 
               ${clusterX + clusterSize * 0.8},${clusterY} 
               ${clusterX + clusterSize * 0.6},${clusterY - clusterSize * 0.3}
              C${clusterX + clusterSize * 0.3},${clusterY - clusterSize * 0.5} 
               ${clusterX},${clusterY - clusterSize * 0.7} 
               ${clusterX - clusterSize * 0.3},${clusterY - clusterSize * 0.5}
              Z`}
          fill={color}
          opacity="0.8"
        />
      );
    }
  }

  return clusters;
}

// Rain effect component
function RainEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-0.5 bg-blue-300 opacity-70"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-${Math.random() * 10}%`,
            height: `${Math.random() * 10 + 10}px`,
            animation: `rainfall ${Math.random() * 1 + 0.5}s linear ${
              Math.random() * 2
            }s infinite`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes rainfall {
          0% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(calc(100% + 10px));
          }
        }
      `}</style>
    </div>
  );
}

// Wind effect component
function WindEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="absolute h-0.5 bg-cyan-100 opacity-30"
          style={{
            left: `-5%`,
            top: `${Math.random() * 80 + 10}%`,
            width: `${Math.random() * 30 + 20}px`,
            animation: `wind ${Math.random() * 3 + 2}s linear ${
              Math.random() * 2
            }s infinite`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes wind {
          0% {
            transform: translateX(-10px);
            opacity: 0;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            transform: translateX(calc(100% + 10px));
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

// Helper function to calculate growth factors based on current level
function calculateGrowthFactor(
  currentLevel: number,
  maxLevel: number,
  minValue: number,
  maxValue: number,
  startLevel = 1,
  endLevel = maxLevel
): number {
  if (currentLevel < startLevel) return minValue;
  if (currentLevel >= endLevel) return maxValue;

  const levelRange = endLevel - startLevel;
  const normalizedLevel = Math.min(currentLevel - startLevel, levelRange);
  const growthPercentage = normalizedLevel / levelRange;

  return minValue + growthPercentage * (maxValue - minValue);
}

// Helper function to adjust color brightness
function adjustColor(color: string, amount: number): string {
  // Convert hex to RGB
  let hex = color;
  if (hex.startsWith("#")) {
    hex = hex.slice(1);
  }

  // Parse the hex values
  const num = Number.parseInt(hex, 16);
  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00ff) + amount;
  let b = (num & 0x0000ff) + amount;

  // Clamp values
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  // Convert back to hex
  return `#${(b | (g << 8) | (r << 16)).toString(16).padStart(6, "0")}`;
}
