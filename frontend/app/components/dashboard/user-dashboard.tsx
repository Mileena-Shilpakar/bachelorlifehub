"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  CheckCircle,
  Clock,
  ListTodo,
  MoreHorizontal,
  Star,
  Trophy,
  Quote,
} from "lucide-react";
import { format } from "date-fns";

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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TaskForm } from "./task-form";
import type { Task } from "@/app/types";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { toast as toastify } from "react-toastify";

interface Milestone {
  id: number;
  name: string;
  total_tasks: number;
  completed_tasks: number;
  remaining_tasks: number;
}

interface DashboardData {
  total_task_count: number;
  completed_task_count: number;
  points: number;
  level: number;
  streak: number;
  highest_streak: number;
  next_milestone: Milestone;
}

interface UserDetails {
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export function UserDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { toast } = useToast();
  const [dashboardData, setDashboardData] = useState<DashboardData>();
  const [userInfo, setUserInfo] = useState<UserDetails>();
  const [currentQuote, setCurrentQuote] = useState(0);

  const inspirationalQuotes = [
    {
      text: "The secret of getting ahead is getting started.",
      author: "Mark Twain",
    },
    {
      text: "It always seems impossible until it's done.",
      author: "Nelson Mandela",
    },
    {
      text: "Don't watch the clock; do what it does. Keep going.",
      author: "Sam Levenson",
    },
    {
      text: "The way to get started is to quit talking and begin doing.",
      author: "Walt Disney",
    },
    {
      text: "You don't have to be great to start, but you have to start to be great.",
      author: "Zig Ziglar",
    },
    {
      text: "The best way to predict the future is to create it.",
      author: "Peter Drucker",
    },
    {
      text: "Either you run the day, or the day runs you.",
      author: "Jim Rohn",
    },
    { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
    {
      text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill",
    },
    {
      text: "The future depends on what you do today.",
      author: "Mahatma Gandhi",
    },
    {
      text: "Setting goals is the first step in turning the invisible into the visible.",
      author: "Tony Robbins",
    },
    {
      text: "Focus on being productive instead of busy.",
      author: "Tim Ferriss",
    },
    {
      text: "The most difficult thing is the decision to act, the rest is merely tenacity.",
      author: "Amelia Earhart",
    },
    {
      text: "Small daily improvements over time lead to stunning results.",
      author: "Robin Sharma",
    },
    {
      text: "Your time is limited, don't waste it living someone else's life.",
      author: "Steve Jobs",
    },
  ];

  const todayTasks = tasks.filter(
    (task) =>
      task.dueDate &&
      format(task.dueDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
  );

  const upcomingTasks = tasks
    .filter(
      (task) =>
        task.status !== "completed" &&
        task.dueDate &&
        task.dueDate > new Date() &&
        format(task.dueDate, "yyyy-MM-dd") !== format(new Date(), "yyyy-MM-dd")
    )
    .sort((a, b) => a.dueDate!.getTime() - b.dueDate!.getTime())
    .slice(0, 5);

  const handleAddTask = async (newTask: Task) => {
    try {
      const formattedDate = newTask.dueDate
        ? new Date(
            newTask.dueDate.getTime() -
              newTask.dueDate.getTimezoneOffset() * 60000
          )
            .toISOString()
            .split("T")[0]
        : "";
      const formattedTags = newTask.tags.map((tag) => ({
        name: tag.toLowerCase(),
      }));

      const response = await axios.post(
        "http://localhost:8000/api/task/tasks/",
        {
          title: newTask.title,
          description: newTask.description,
          due_date: formattedDate,
          status: newTask.status,
          priority: newTask.priority,
          estimated_time: newTask.estimatedTime,
          tags: formattedTags,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("task-token")}`,
          },
        }
      );

      const savedTask = {
        ...newTask,
        id: response.data.id.toString(),
      };

      toastify.success("Task Created !!!");
      setTasks([...tasks, savedTask]);
      setIsDialogOpen(false);
      setEditingTask(null);
    } catch (err) {
      console.log(err);
      toastify.error("Failed to create task");
    }
  };

  const handleEditTask = async (updatedTask: Task) => {
    try {
      const formattedDate = updatedTask.dueDate
        ? new Date(
            updatedTask.dueDate.getTime() -
              updatedTask.dueDate.getTimezoneOffset() * 60000
          )
            .toISOString()
            .split("T")[0]
        : "";
      const formattedTags = updatedTask.tags.map((tag) => ({
        name: tag.toLowerCase(),
      }));
      const response = await axios.put(
        `http://localhost:8000/api/task/tasks/${updatedTask.id}/`,
        {
          title: updatedTask.title,
          description: updatedTask.description,
          due_date: formattedDate,
          status: updatedTask.status,
          priority: updatedTask.priority,
          estimated_time: updatedTask.estimatedTime,
          tags: formattedTags,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("task-token")}`,
          },
        }
      );
      toastify.success(response.data.detail);
      setTasks(
        tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
      setIsDialogOpen(false);
      setEditingTask(null);
    } catch (err) {
      console.log(err);
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return (
          <Badge
            variant="outline"
            className="bg-amber-100 text-amber-700 hover:bg-amber-200"
          >
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-700 hover:bg-green-200"
          >
            Low
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote(
        (prevQuote) => (prevQuote + 1) % inspirationalQuotes.length
      );
    }, 20000);

    return () => clearInterval(quoteInterval);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/task/tasks",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("task-token")}`,
            },
          }
        );

        const transformedTasks = response.data.map((task: any) => ({
          id: task.id.toString(),
          title: task.title,
          description: task.description,
          dueDate: task.due_date ? new Date(task.due_date) : null,
          status: task.status,
          priority: task.priority,
          estimatedTime: task.estimated_time,
          timeSpent: task.time_spent,
          tags: task.tags.map((tag: { name: string }) => tag.name),
          createdAt: new Date(task.created_at),
          updatedAt: new Date(task.updated_at),
        }));

        setTasks(transformedTasks);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        toast({
          title: "Error",
          description: "Failed to fetch tasks",
          variant: "destructive",
        });
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    if (typeof window === undefined) return;
    const fetchUser = async () => {
      const response = await axios.get(
        "http://localhost:8000/api/user/profile/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("task-token")}`,
          },
        }
      );
      setUserInfo(response.data);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (typeof window === undefined) return;
    const fetchDashboardData = async () => {
      const response = await axios.get("http://localhost:8000/api/dashboard/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("task-token")}`,
        },
      });
      setDashboardData(response.data);
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6 dark:bg-black dark:text-[#959595]">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-shuttle-gray text-black dark:text-white">
            Welcome back,{" "}
            <span className="dark:text-[#BB86FC]">
              {userInfo?.user?.first_name || "Friend"}{" "}
              {userInfo?.user?.last_name}
            </span>
          </h1>
          <p className="text-muted-foreground dark:text-[#959595]">
            {format(new Date(), "EEEE, MMMM do, yyyy")}
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingTask(null);
            setIsDialogOpen(true);
          }}
          variant="secondary"
          className="dark:bg-[#BB86FC] dark:text-white"
        >
          Create New Task
        </Button>
      </div>

      <Card className="overflow-hidden border bg-gray-50 dark:border-gray-800 dark:bg-[#1D1D1D] shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-gray-200 dark:bg-gray-800 p-2">
              <Quote className="h-5 w-5 text-gray-600 dark:text-white" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium italic text-gray-800 dark:text-gray-300">
                "{inspirationalQuotes[currentQuote].text}"
              </p>
              <p className="text-sm text-gray-500">
                — {inspirationalQuotes[currentQuote].author}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden border bg-gray-50 dark:border-gray-800 dark:bg-[#1D1D1D] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 dark:text-gray-300">
            <CardTitle className="text-sm font-medium ">Total Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground dark:text-gray-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-white">
              {dashboardData?.total_task_count || "--"}
            </div>
            <p className="text-xs text-muted-foreground dark:text-gray-500">
              Tasks created
            </p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border bg-gray-50 dark:border-gray-800 dark:bg-[#1D1D1D] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 dark:text-gray-300">
            <CardTitle className="text-sm font-medium">
              Completed Tasks
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground dark:text-gray-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-white">
              {dashboardData?.completed_task_count || "--"}
            </div>
            <div className="mt-1">
              <Progress
                value={
                  dashboardData?.total_task_count
                    ? Math.round(
                        (dashboardData.completed_task_count /
                          dashboardData.total_task_count) *
                          100
                      )
                    : 0
                }
                className="h-2"
              />
            </div>
            <p className="text-xs text-muted-foreground dark:text-gray-500 mt-1">
              {dashboardData?.total_task_count
                ? Math.round(
                    (dashboardData.completed_task_count /
                      dashboardData.total_task_count) *
                      100
                  )
                : 0}
              % completion rate
            </p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border bg-gray-50 dark:border-gray-800 dark:bg-[#1D1D1D] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 dark:text-gray-300">
            <CardTitle className="text-sm font-medium">Points</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground dark:text-gray-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-white">
              {dashboardData?.points || "--"}
            </div>
            <p className="text-xs text-muted-foreground dark:text-gray-500">
              Level {dashboardData?.level || "--"}
            </p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border bg-gray-50 dark:border-gray-800 dark:bg-[#1D1D1D] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 dark:text-gray-300">
            <CardTitle className="text-sm font-medium">
              Next Milestone
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground dark:text-gray-300" />
          </CardHeader>
          <CardContent>
            <div className="text-md font-medium truncate dark:text-white">
              {dashboardData?.next_milestone?.name || "All completed!"}
            </div>
            <div className="mt-1">
              <Progress
                value={
                  dashboardData?.next_milestone
                    ? Math.min(
                        100,
                        Math.round(
                          (dashboardData.next_milestone?.completed_tasks /
                            dashboardData.next_milestone?.total_tasks) *
                            100
                        )
                      )
                    : 0
                }
                className="h-2"
              />
            </div>
            <p className="text-xs text-muted-foreground dark:text-gray-500 mt-1">
              {dashboardData?.next_milestone
                ? `${dashboardData?.next_milestone?.completed_tasks}/${
                    dashboardData?.next_milestone?.total_tasks
                  } tasks (${
                    dashboardData?.next_milestone
                      ? Math.min(
                          100,
                          Math.round(
                            (dashboardData.next_milestone?.completed_tasks /
                              dashboardData.next_milestone?.total_tasks) *
                              100
                          )
                        )
                      : 0
                  }%)`
                : "Congratulations!"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden border bg-gray-50 dark:border-gray-800 dark:bg-[#1D1D1D] shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg dark:text-gray-300">
              Today's Tasks
            </CardTitle>
            <CardDescription className="dark:text-gray-500">
              Tasks due today - {format(new Date(), "MMM d, yyyy")}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {todayTasks.length > 0 ? (
            <div className="space-y-2">
              {todayTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
                  onClick={() => {
                    setEditingTask(task);
                    setIsDialogOpen(true);
                  }}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{task.title}</span>
                      {getPriorityBadge(task.priority)}
                    </div>
                    <span className="text-xs text-muted-foreground line-clamp-1">
                      {task.description}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {task.estimatedTime && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{task.estimatedTime} min</span>
                      </div>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6">
              <p className="text-muted-foreground dark:text-gray-500 mb-2">
                No tasks due today
              </p>
              <Button
                variant="outline"
                className="dark:bg-[#BB86FC] dark:text-white"
                onClick={() => {
                  setEditingTask(null);
                  setIsDialogOpen(true);
                }}
              >
                Create One
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="overflow-hidden border bg-gray-50 dark:border-gray-800 dark:bg-[#1D1D1D] shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg dark:text-gray-300">
            Upcoming Tasks
          </CardTitle>
          <CardDescription className="dark:text-gray-500">
            Your next 5 upcoming tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingTasks.length > 0 ? (
            <div className="space-y-2">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted dark:bg-[#606266] dark:hover:bg-[#4b4c50]"
                  onClick={() => {
                    setEditingTask(task);
                    setIsDialogOpen(true);
                  }}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">
                        {task.title}
                      </span>
                      {getPriorityBadge(task.priority)}
                    </div>
                    <span className="text-xs text-muted-foreground line-clamp-1 text-gray-300">
                      {task.description}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {task.dueDate && format(task.dueDate, "MMM d")}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6">
              <p className="text-muted-foreground dark:text-gray-500">
                No upcoming tasks
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            className="w-full dark:bg-[#BB86FC] dark:text-white"
            asChild
          >
            <a href="/dashboard/calendar">View Full Calendar</a>
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingTask ? "Edit Task" : "Create New Task"}
            </DialogTitle>
          </DialogHeader>
          <TaskForm
            task={editingTask}
            onSave={editingTask ? handleEditTask : handleAddTask}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
