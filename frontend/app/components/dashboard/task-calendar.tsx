// "use client";

// import { useState, useEffect, useMemo } from "react";
// import {
//   format,
//   startOfMonth,
//   endOfMonth,
//   eachDayOfInterval,
//   isSameMonth,
//   isSameDay,
//   addMonths,
//   subMonths,
// } from "date-fns";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { TaskForm } from "./task-form";
// import type { Task } from "@/app/types";
// import { useToast } from "@/hooks/use-toast";
// import axios from "axios";

// export function TaskCalendar() {
//   const { toast } = useToast();
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [currentDate, setCurrentDate] = useState<Date | null>(null);
//   const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   useEffect(() => {
//     setCurrentDate(new Date());
//   }, []);

//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const fetchTasks = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:8000/api/task/tasks",
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("task-token")}`,
//             },
//           }
//         );

//         const transformedTasks = response.data.map((task: any) => ({
//           id: task.id.toString(),
//           title: task.title,
//           description: task.description,
//           dueDate: task.due_date ? new Date(task.due_date) : null,
//           status: task.status,
//           priority: task.priority,
//           estimatedTime: task.estimated_time,
//           timeSpent: task.time_spent,
//           tags: task.tags.map((tag: { name: string }) => tag.name),
//           createdAt: new Date(task.created_at),
//           updatedAt: new Date(task.updated_at),
//         }));

//         setTasks(transformedTasks);
//       } catch (err) {
//         console.error("Error fetching tasks:", err);
//         toast({
//           title: "Error",
//           description: "Failed to fetch tasks",
//           variant: "destructive",
//         });
//       }
//     };

//     fetchTasks();
//   }, []);

//   const monthData = useMemo(() => {
//     if (!currentDate) return null;

//     const monthStart = startOfMonth(currentDate);
//     const monthEnd = endOfMonth(currentDate);
//     const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

//     return {
//       allDays: daysInMonth,
//     };
//   }, [currentDate]);

//   if (!currentDate || !monthData) return null;

//   const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
//   const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
//   const goToToday = () => setCurrentDate(new Date());

//   const handleTaskClick = (task: Task) => {
//     setSelectedTask(task);
//     setIsDialogOpen(true);
//   };

//   const getTasksForDate = (date: Date): Task[] =>
//     tasks.filter((task) => task.dueDate && isSameDay(task.dueDate, date));

//   const getPriorityColor = (priority: string) => {
//     switch (priority) {
//       case "high":
//         return "bg-red-400 dark:bg-red-400 dark:text-white";
//       case "medium":
//         return "bg-amber-400 dark:bg-yellow-300 dark:text-black";
//       case "low":
//         return "bg-green-400 dark:bg-green-300 dark:text-black";
//       default:
//         return "bg-muted";
//     }
//   };

//   return (
//     <div className="flex flex-col space-y-4">
//       {/* Header Section */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-bold text-shuttle-gray dark:text-white">
//           Calendar
//         </h2>
//         <div className="flex items-center space-x-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={goToToday}
//             className="text-sm dark:bg-[#BB86FC] dark:text-white dark:border-none"
//           >
//             Today
//           </Button>
//           <Button
//             variant="outline"
//             size="icon"
//             onClick={goToPreviousMonth}
//             className="dark:bg-[#BB86FC] dark:text-white dark:border-none"
//           >
//             <ChevronLeft className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="outline"
//             size="icon"
//             onClick={goToNextMonth}
//             className="dark:bg-[#BB86FC] dark:text-white dark:border-none"
//           >
//             <ChevronRight className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>

//       {/* Month Display */}
//       <div className="text-center mb-4 dark:text-white">
//         <h3 className="text-xl font-medium text-shuttle-gray">
//           <span suppressHydrationWarning>
//             {format(currentDate, "MMMM yyyy")}
//           </span>
//         </h3>
//       </div>

//       {/* Calendar Grid */}
//       <div className="grid grid-cols-7 gap-1">
//         {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
//           <div
//             key={day}
//             className="text-center text-sm font-medium text-muted-foreground py-2 dark:text-[#959595]"
//           >
//             {day}
//           </div>
//         ))}
//       </div>

//       <div className="grid grid-cols-7 gap-1">
//         {monthData.allDays.map((day, i) => {
//           const isCurrentMonth = isSameMonth(day, currentDate);
//           const isToday = isSameDay(day, new Date());
//           const tasksForDay = getTasksForDate(day);

//           return (
//             <div
//               key={i}
//               className={`min-h-[100px] border rounded-md p-1 ${
//                 isCurrentMonth
//                   ? "bg-card dark:bg-gray-400"
//                   : "bg-muted/30 dark:bg-gray-700 dark:text-gray-400"
//               } ${
//                 isToday ? "border-logan" : "border-border"
//               } hover:bg-muted/50 cursor-pointer transition-colors`}
//             >
//               <div className="text-right p-1 text-sm">{format(day, "d")}</div>
//               {tasksForDay.slice(0, 3).map((task) => (
//                 <div
//                   key={task.id}
//                   onClick={() => handleTaskClick(task)}
//                   className={`text-xs px-2 py-1 rounded cursor-pointer ${getPriorityColor(
//                     task.priority
//                   )}`}
//                 >
//                   {task.title}
//                 </div>
//               ))}
//             </div>
//           );
//         })}
//       </div>

//       {/* Task Details Dialog */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Task Details</DialogTitle>
//           </DialogHeader>
//           {selectedTask && (
//             <div className="space-y-2">
//               <p>
//                 <strong>Title:</strong> {selectedTask.title}
//               </p>
//               <p>
//                 <strong>Description:</strong> {selectedTask.description}
//               </p>
//               <p>
//                 <strong>Priority:</strong> {selectedTask.priority}
//               </p>
//               <p>
//                 <strong>Due Date:</strong>{" "}
//                 {selectedTask.dueDate
//                   ? format(selectedTask.dueDate, "PPP")
//                   : "No due date"}
//               </p>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
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

export function TaskCalendar() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setCurrentDate(new Date());
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

  const monthData = useMemo(() => {
    if (!currentDate) return null;

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return {
      allDays: daysInMonth,
    };
  }, [currentDate]);

  if (!currentDate || !monthData) return null;

  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const getTasksForDate = (date: Date): Task[] =>
    tasks.filter((task) => task.dueDate && isSameDay(task.dueDate, date));

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-400 text-white";
      case "medium":
        return "bg-amber-400 text-black";
      case "low":
        return "bg-green-400 text-black";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-shuttle-gray dark:text-white">
          Calendar
        </h2>
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-serif dark:text-gray-400">
            {format(currentDate, "MMMM yyyy")}
          </h2>

          <Button
            variant="outline"
            className="text-sm dark:bg-[#BB86FC] dark:text-white dark:border-none"
            size="sm"
            onClick={goToToday}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToPreviousMonth}
            className="dark:bg-[#BB86FC] dark:text-white dark:border-none"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNextMonth}
            className="dark:bg-[#BB86FC] dark:text-white dark:border-none"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {monthData.allDays.map((day, i) => {
          const isToday = isSameDay(day, new Date());
          const tasksForDay = getTasksForDate(day);

          return (
            <div
              key={i}
              className={`min-h-[100px] border rounded-md p-1 ${
                isToday
                  ? "bg-purple-300 text-black border-blue-700"
                  : "bg-muted border-border border-spacing-0"
              } hover: cursor-pointer`}
            >
              <div className="text-right p-1 text-sm">{format(day, "d")}</div>
              {tasksForDay.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleTaskClick(task)}
                  className={`text-xs px-2 py-1 rounded cursor-pointer ${getPriorityColor(
                    task.priority
                  )}`}
                >
                  {task.title} ({task.priority})
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Task Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="dark:bg-[#1F1F1F]">
          <DialogHeader>
            <DialogTitle className="dark:text-gray-500">
              Task Details
            </DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-2">
              <p className="dark:text-gray-500">
                <strong>Title:</strong> {selectedTask.title}
              </p>
              <p className="dark:text-gray-500">
                <strong>Description:</strong> {selectedTask.description}
              </p>
              <p className="dark:text-gray-500">
                <strong>Priority:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded ${getPriorityColor(
                    selectedTask.priority
                  )}`}
                >
                  {selectedTask.priority}
                </span>
              </p>
              <p className="dark:text-gray-500">
                <strong>Due Date:</strong>{" "}
                {selectedTask.dueDate
                  ? format(selectedTask.dueDate, "PPP")
                  : "No due date"}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
