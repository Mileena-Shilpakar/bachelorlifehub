"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { FerrisWheel, PlusCircle, Search } from "lucide-react";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TaskCard } from "./task-card";
import { TaskForm } from "./task-form";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import type { Task, Status } from "@/app/types";
// import { tasks as initialTasks } from "@/app/data/mock-data"
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { toast as toastify } from "react-toastify";
import { useRouter } from "next/navigation";

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const { toast } = useToast();
  const { width, height } = useWindowSize();
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const columns: { id: Status; title: string }[] = [
    { id: "todo", title: "To Do" },
    { id: "in_progress", title: "In Progress" },
    { id: "completed", title: "Completed" },
  ];

  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  // Filter tasks when search query or tasks change
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTasks(tasks);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.tags.some((tag) => tag.toLowerCase().includes(query))
      );
      setFilteredTasks(filtered);
    }
  }, [searchQuery, tasks]);

  const triggerConfetti = useCallback(() => {
    setShowConfetti(true);
    setShowReward(true);
    setProgressValue(0);
    setTotalPoints((prev) => prev + 20);

    // Start progress bar animation
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    progressInterval.current = setInterval(() => {
      setProgressValue((prev) => {
        if (prev >= 100) {
          if (progressInterval.current) {
            clearInterval(progressInterval.current);
          }
          return 100;
        }
        return prev + 2.5; // 100% / 4 seconds * 100ms = 2.5% per update
      });
    }, 100);

    // Hide elements after 4 seconds
    setTimeout(() => {
      setShowConfetti(false);
      setShowReward(false);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }, 4000);

    toast({
      title: "Task completed!",
      description: "Great job! You earned 20 points.",
    });
  }, [toast]);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;
    const updatedTasks = tasks?.map((task) => {
      if (task.id === draggableId) {
        const newTask = { ...task, status: destination.droppableId as Status };

        if (
          destination.droppableId === "completed" &&
          source.droppableId !== "completed"
        ) {
          triggerConfetti();
        }

        return newTask;
      }
      return task;
    });
    setTasks(updatedTasks);
    const movedTask = tasks.find((task) => task.id === draggableId);
    if (movedTask) {
      try {
        const formattedDate = movedTask.dueDate
          ? new Date(
              movedTask.dueDate.getTime() -
                movedTask.dueDate.getTimezoneOffset() * 60000
            )
              .toISOString()
              .split("T")[0]
          : "";
        const formattedTags = movedTask.tags.map((tag) => ({
          name: tag.toLowerCase(),
        }));

        await axios.put(
          `http://localhost:8000/api/task/tasks/${draggableId}/`,
          {
            title: movedTask.title,
            description: movedTask.description,
            due_date: formattedDate,
            status: destination.droppableId,
            priority: movedTask.priority,
            estimated_time: movedTask.estimatedTime,
            tags: formattedTags,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("task-token")}`,
            },
          }
        );
        toastify.success("Task status updated!");
      } catch (err) {
        console.error("Error updating task status:", err);
        toastify.error("Failed to update task status");
        setTasks(tasks);
      }
    }
  };

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

  const handleDeleteTask = async (taskId: string) => {
    if (typeof window === undefined) return;
    setTasks(tasks.filter((task) => task.id !== taskId));
    try {
      await axios.delete(`http://localhost:8000/api/task/tasks/${taskId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("task-token")}`,
        },
      });
      toastify.success("Task has been deleted");
    } catch (err) {
      console.log(err);
    }
  };

  const handleStatusChange = (taskId: string, newStatus: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, status: newStatus as Status };
      }
      return task;
    });
    setTasks(updatedTasks);

    if (newStatus === "completed") {
      triggerConfetti();
    }
  };

  const openTaskDialog = (task?: Task) => {
    if (task) {
      setEditingTask(task);
    } else {
      setEditingTask(null);
    }
    setIsDialogOpen(true);
  };

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
    const fetchUser = async () => {
      const response = await axios.get(
        `http://localhost:8000/api/user/profile/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("task-token")}`,
          },
        }
      );
      setTotalPoints(response.data.points);
    };
    fetchUser();
  }, []);

  return (
    <>
      {showConfetti && (
        <ReactConfetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={700}
          gravity={0.3}
        />
      )}

      {/* Reward notification and progress bar */}
      {showReward && (
        <div className="fixed top-12 right-12 z-50 bg-white/90 backdrop-blur-sm shadow-lg rounded-lg p-4 w-64 border border-logan">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-bold text-green-600">
              Yay! +20 points collected!
            </span>
            <span className="text-sm font-medium text-gray-700">
              Total: {totalPoints}
            </span>
          </div>
          <Progress value={progressValue} className="h-2 bg-gray-200" />
        </div>
      )}

      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-shuttle-gray dark:text-white">My Tasks</h2>
          <div className="flex items-center gap-4">
            <div className="bg-logan/10 px-3 py-1 rounded-full text-sm font-medium text-logan dark:text-white">
              🏆 Points: {totalPoints}
            </div>
            <Button onClick={() => openTaskDialog()} variant="default" className="dark:bg-[#BB86FC] dark:text-white">
              <PlusCircle className="h-4 w-4" /> Add Task
            </Button>
            <Button
              onClick={() => router.push("/dashboard/task-roulette")}
              variant="default"
              className="dark:bg-[#BB86FC] dark:text-white"
            >
              <FerrisWheel className="h-4 w-4" /> Spin To Choose
            </Button>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search tasks by title, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full dark:bg-[#1D1D1D] dark:border-none dark:placeholder:text-[#D1D5DB] dark:text-[#D1D5DB] dark:focus:ring-0"
          />
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {columns.map((column) => (
              <div key={column.id} className="flex flex-col">
                <h3 className="text-shuttle-gray font-medium text-sm py-2 px-4 bg-muted rounded-t-md dark:bg-[#BB86FC] dark:text-white">
                  {column.title} (
                  {
                    filteredTasks.filter((task) => task.status === column.id)
                      .length
                  }
                  )
                </h3>
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="kanban-column flex-1 rounded-b-md"
                    >
                      {filteredTasks
                        .filter((task) => task.status === column.id)
                        .map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <TaskCard
                                  task={task}
                                  onEdit={() => openTaskDialog(task)}
                                  onDelete={handleDeleteTask}
                                  onStatusChange={handleStatusChange}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                      {filteredTasks.filter((task) => task.status === column.id)
                        .length === 0 && (
                        <div className="text-center p-4 text-sm text-muted-foreground dark:text-gray-500">
                          No tasks yet
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md dark:bg-[#1F1F1F] dark:border-none dark:text-gray-300">
          <DialogHeader>
            <DialogTitle>
              {editingTask ? "Edit Task" : "Create New Task"}
            </DialogTitle>
            <DialogDescription className="dark:text-gray-500">
              {editingTask
                ? "Update the details of your task."
                : "Fill in the details to create a new task."}
            </DialogDescription>
          </DialogHeader>
          <TaskForm
            task={editingTask}
            onSave={editingTask ? handleEditTask : handleAddTask}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
