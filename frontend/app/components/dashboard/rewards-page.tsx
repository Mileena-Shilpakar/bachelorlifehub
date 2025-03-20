// "use client";

// import { useEffect, useState } from "react";
// import { Award, GiftIcon, Trophy, Flame } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { TaskConfetti } from "./task-confetti";
// import { useToast } from "@/hooks/use-toast";
// import axios from "axios";
// import GrowingTreeCard from "@/app/dashboard/tree/growing-tree-card";

// interface MilestoneType {
//   id: number;
//   name: string;
//   total_tasks: number;
//   completed_tasks: number;
//   is_completed: boolean;
//   reward_points: number;
// }

// interface PointInterface {
//   points: number;
//   level: number;
//   streak: number;
//   highest_streak: number;
// }

// export function RewardsPage() {
//   const [showConfetti, setShowConfetti] = useState(false);
//   const { toast } = useToast();
//   const [points, setPoints] = useState<PointInterface>();
//   const [milestone, setMilestone] = useState<MilestoneType[]>([]);
//   const [level, setLevel] = useState(100);
//   const [animationSpeed, setAnimationSpeed] = useState(1);
//   const [weather, setWeather] = useState<
//     "sunny" | "cloudy" | "rainy" | "windy"
//   >("sunny");
//   const [colors, setColors] = useState({
//     trunk: "#8B4513",
//     branches: "#A0522D",
//     leaves: "#228B22",
//     soil: "#5D4037",
//     background: "#f8fafc",
//   });

//   const claimReward = (rewardId: string) => {
//     setShowConfetti(true);
//     setTimeout(() => setShowConfetti(false), 4000);

//     toast({
//       title: "Reward claimed!",
//       description: "Congratulations on your achievement!",
//     });
//   };

//   // Calculate points needed for next level
//   const calculateNextLevelPoints = (level: number) => {
//     if (level === 1) return 100;
//     return 250 * (level - 1);
//   };

//   // Calculate progress percentage to next level
//   const calculateProgressPercentage = (
//     currentPoints: number,
//     level: number
//   ) => {
//     const currentLevelThreshold =
//       level === 1 ? 0 : level === 2 ? 100 : 100 + 250 * (level - 2);
//     const nextLevelThreshold = calculateNextLevelPoints(level);
//     const pointsInCurrentLevel = currentPoints - currentLevelThreshold;
//     const pointsRequiredForNextLevel =
//       nextLevelThreshold - currentLevelThreshold;
//     return (pointsInCurrentLevel / pointsRequiredForNextLevel) * 100;
//   };

//   useEffect(() => {
//     if (typeof window === undefined) return;
//     const fetchPointLevel = async () => {
//       const response = await axios.get(
//         "http://localhost:8000/api/user/profile/",
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("task-token")}`,
//           },
//         }
//       );
//       setPoints(response.data);
//     };
//     fetchPointLevel();
//   }, []);

//   useEffect(() => {
//     if (typeof window === undefined) return;
//     const fetchMilestones = async () => {
//       const response = await axios.get(
//         "http://localhost:8000/api/task/milestones/",
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("task-token")}`,
//           },
//         }
//       );
//       setMilestone(response.data);
//     };
//     fetchMilestones();
//   }, []);

//   // Get points needed for next level
//   const nextLevelPoints = points?.level
//     ? calculateNextLevelPoints(points.level)
//     : 100;

//   // Get points remaining to reach next level
//   const pointsRemaining =
//     points?.points !== undefined ? nextLevelPoints - points.points : 0;

//   return (
//     <div className="space-y-6">
//       {showConfetti && <TaskConfetti />}

//       <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-shuttle-gray">
//             Your Achievements
//           </h1>
//           <p className="text-muted-foreground">
//             Track your progress and unlock rewards
//           </p>
//         </div>
//       </div>

//       {/* User Progress Card */}
//       <Card>
//         <CardHeader className="pb-2">
//           <CardTitle className="text-lg">Your Progress</CardTitle>
//           <CardDescription>
//             Level up by completing tasks and milestones
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-col md:flex-row md:items-center gap-6">
//             <div className="flex items-center gap-4">
//               <div className="w-16 h-16 rounded-full bg-logan flex items-center justify-center text-2xl font-bold text-white">
//                 {points?.level || "--"}
//               </div>
//               <div>
//                 <p className="font-medium">Level {points?.level || "--"}</p>
//                 <p className="text-sm text-muted-foreground">
//                   {points?.points || "--"} points earned
//                 </p>
//               </div>
//             </div>

//             <div className="flex-1">
//               <div className="flex justify-between text-sm mb-1">
//                 <span>
//                   Progress to Level {points?.level ? points.level + 1 : "--"}
//                 </span>
//                 <span>
//                   {points?.points || "--"}/{nextLevelPoints} points
//                 </span>
//               </div>
//               <Progress
//                 value={
//                   points?.points !== undefined && points?.level !== undefined
//                     ? calculateProgressPercentage(points.points, points.level)
//                     : 0
//                 }
//                 className="h-2"
//               />
//             </div>

//             {/* Streak Information */}
//             <div className="flex items-center gap-2 bg-amber-50 rounded-lg p-2 border border-amber-200">
//               <Flame className="h-8 w-8 text-amber-500" />
//               <div>
//                 <div className="flex items-center gap-1">
//                   <span className="font-semibold text-amber-700">
//                     {points?.streak || 0}
//                   </span>
//                   <span className="text-sm text-amber-600">current streak</span>
//                 </div>
//                 <p className="text-xs text-amber-600">
//                   Best: {points?.highest_streak || 0} streak
//                 </p>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//       <GrowingTreeCard
//         level={level}
//         colors={colors}
//         animationSpeed={animationSpeed}
//         weather={weather}
//         title="My Growing Tree"
//         className="md:col-span-1"
//       />
//       {/* Rewards and Milestones */}
//       <Tabs defaultValue="milestones" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="milestones" className="flex items-center gap-2">
//             <Trophy className="h-4 w-4" />
//             Milestones
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="milestones" className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {milestone.map((milestone) => (
//               <Card
//                 key={milestone.id}
//                 className={`${!milestone.is_completed && "bg-muted/40"}`}
//               >
//                 <CardHeader className="pb-2">
//                   <div className="flex justify-between items-start">
//                     <CardTitle className="text-lg">{milestone.name}</CardTitle>
//                     <Award className="h-5 w-5 text-muted-foreground" />
//                   </div>
//                   <CardDescription>
//                     Completed {milestone.completed_tasks} tasks
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex justify-between text-sm mb-1">
//                     <span>Task Completion</span>
//                     <span>
//                       {milestone.completed_tasks}/{milestone.total_tasks}
//                     </span>
//                   </div>
//                   <Progress
//                     value={
//                       (milestone.completed_tasks / milestone.total_tasks) * 100
//                     }
//                     className="h-2"
//                   />
//                   <p className="text-sm mt-2 text-muted-foreground">
//                     Reward: {milestone.reward_points} points
//                   </p>
//                 </CardContent>
//                 <CardFooter>
//                   <Button
//                     variant="outline"
//                     className="w-full"
//                     disabled={!milestone.is_completed}
//                   >
//                     {milestone.is_completed ? "Completed" : "In Progress"}
//                   </Button>
//                 </CardFooter>
//               </Card>
//             ))}
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { Award, Flame, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskConfetti } from "./task-confetti";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import GrowingTreeCard from "@/app/dashboard/tree/growing-tree-card";

interface MilestoneType {
  id: number;
  name: string;
  total_tasks: number;
  completed_tasks: number;
  is_completed: boolean;
  reward_points: number;
}

interface PointInterface {
  points: number;
  level: number;
  streak: number;
  highest_streak: number;
}

export function RewardsPage() {
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();
  const [points, setPoints] = useState<PointInterface>();
  const [milestone, setMilestone] = useState<MilestoneType[]>([]);
  const [level, setLevel] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [weather, setWeather] = useState<
    "sunny" | "cloudy" | "rainy" | "windy"
  >("sunny");
  const [colors, setColors] = useState({
    trunk: "#8B4513",
    branches: "#A0522D",
    leaves: "#228B22",
    soil: "#5D4037",
    background: "#f8fafc",
  });

  const claimReward = (rewardId: string) => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);

    toast({
      title: "Reward claimed!",
      description: "Congratulations on your achievement!",
    });
  };

  // Calculate points needed for next level
  const calculateNextLevelPoints = (level: number) => {
    if (level === 1) return 100;
    return 250 * (level - 1);
  };

  // Calculate progress percentage to next level
  const calculateProgressPercentage = (
    currentPoints: number,
    level: number
  ) => {
    const currentLevelThreshold =
      level === 1 ? 0 : level === 2 ? 100 : 100 + 250 * (level - 2);
    const nextLevelThreshold = calculateNextLevelPoints(level);
    const pointsInCurrentLevel = currentPoints - currentLevelThreshold;
    const pointsRequiredForNextLevel =
      nextLevelThreshold - currentLevelThreshold;
    return (pointsInCurrentLevel / pointsRequiredForNextLevel) * 100;
  };

  useEffect(() => {
    if (typeof window === undefined) return;

    const fetchPointLevel = async () => {
      const response = await axios.get(
        "http://localhost:8000/api/user/profile/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("task-token")}`,
          },
        }
      );
      setLevel(response.data.level);
      setPoints(response.data);
    };
    fetchPointLevel();
  }, []);

  useEffect(() => {
    if (typeof window === undefined) return;

    const fetchMilestones = async () => {
      const response = await axios.get(
        "http://localhost:8000/api/task/milestones/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("task-token")}`,
          },
        }
      );
      setMilestone(response.data);
    };
    fetchMilestones();
  }, []);

  // Set random weather on mount
  useEffect(() => {
    const weatherOptions: ("sunny" | "cloudy" | "rainy" | "windy")[] = [
      "sunny",
      "cloudy",
      "rainy",
      "windy",
    ];
    setWeather(
      weatherOptions[Math.floor(Math.random() * weatherOptions.length)]
    );
  }, []);

  // Get points needed for next level
  const nextLevelPoints = points?.level
    ? calculateNextLevelPoints(points.level)
    : 100;

  // Get points remaining to reach next level
  const pointsRemaining =
    points?.points !== undefined ? nextLevelPoints - points.points : 0;

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        {showConfetti && <TaskConfetti />}

        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-shuttle-gray dark:text-white">
              Your Achievements
            </h1>
            <p className="text-muted-foreground dark:text-[#959595]">
              Track your progress and unlock rewards
            </p>
          </div>
        </div>

        {/* User Progress Card */}
        <Card className="overflow-hidden border bg-gray-50 dark:border-gray-800 dark:bg-[#1D1D1D] shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg dark:text-[#D1D5DB]">
              Your Progress
            </CardTitle>
            <CardDescription className="dark:text-gray-500">
              Level up by completing tasks and milestones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-logan flex items-center justify-center text-2xl font-bold text-white">
                  {points?.level || "--"}
                </div>
                <div>
                  <p className="font-medium dark:text-gray-500">
                    Level {points?.level || "--"}
                  </p>
                  <p className="text-sm text-muted-foreground dark:text-gray-500">
                    {points?.points || "--"} points earned
                  </p>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1 dark:text-[#D1D5DB]">
                  <span>
                    Progress to Level {points?.level ? points.level + 1 : "--"}
                  </span>
                  <span>
                    {points?.points || "--"}/{nextLevelPoints} points
                  </span>
                </div>
                <Progress
                  value={
                    points?.points !== undefined && points?.level !== undefined
                      ? calculateProgressPercentage(points.points, points.level)
                      : 0
                  }
                  className="h-2 dark:bg-[#BB86FC]"
                />
              </div>

              {/* Streak Information */}
              <div className="flex items-center gap-2 bg-amber-50 rounded-lg p-2 border border-amber-200">
                <Flame className="h-8 w-8 text-amber-500" />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-amber-700">
                      {points?.streak || 0}
                    </span>
                    <span className="text-sm text-amber-600">
                      current streak
                    </span>
                  </div>
                  <p className="text-xs text-amber-600">
                    Best: {points?.highest_streak || 0} streak
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rewards and Milestones */}
        <Tabs defaultValue="milestones" className="space-y-4">
          <TabsList>
            <TabsTrigger
              value="milestones"
              className="flex items-center gap-2 dark:bg-[#BB86FC] dark:text-white dark:border-none"
            >
              <Trophy className="h-4 w-4" />
              Milestones
            </TabsTrigger>
          </TabsList>

          <TabsContent value="milestones" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {milestone.map((milestone) => (
                <Card
                  key={milestone.id}
                  className={`${
                    !milestone.is_completed
                      ? "bg-muted/40 dark:bg-gray-900"
                      : "dark:bg-gray-800"
                  } dark:border-none dark:text-white`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">
                        {milestone.name}
                      </CardTitle>
                      <Award className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <CardDescription>
                      Completed {milestone.completed_tasks} tasks
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Task Completion</span>
                      <span>
                        {milestone.completed_tasks}/{milestone.total_tasks}
                      </span>
                    </div>
                    <Progress
                      value={
                        (milestone.completed_tasks / milestone.total_tasks) *
                        100
                      }
                      className="h-2"
                    />
                    <p className="text-sm mt-2 text-muted-foreground">
                      Reward: {milestone.reward_points} points
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full dark:bg-gray-900 dark:border-none dark:hover:text-white"
                      disabled={!milestone.is_completed}
                    >
                      {milestone.is_completed ? "Completed" : "In Progress"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Growing Tree Card on the right */}
      <div className="flex-none">
        <GrowingTreeCard
          level={level}
          colors={colors}
          animationSpeed={animationSpeed}
          weather={weather}
          title="My Growing Tree"
          className="md:col-span-1"
        />
      </div>
    </div>
  );
}
