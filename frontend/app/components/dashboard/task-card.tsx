"use client";

import { useState } from "react";
import { Clock, MoreHorizontal, Tag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Task } from "@/app/types";
import { TaskTimer } from "./task-timer";

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, newStatus: string) => void;
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskCardProps) {
  const [isTimerDialogOpen, setIsTimerDialogOpen] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-destructive bg-destructive/10 hover:bg-destructive/20";
      case "medium":
        return "text-amber-600 bg-amber-100 hover:bg-amber-200";
      case "low":
        return "text-green-600 bg-green-100 hover:bg-green-200";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const getTimeProgress = () => {
    if (!task.estimatedTime) return 0;

    const parseTimeSpent = (timeStr: string | number | undefined): number => {
      if (!timeStr) return 0;

      if (typeof timeStr === "number") return timeStr * 60;

      if (typeof timeStr === "string" && timeStr.includes(":")) {
        const parts = timeStr.split(":");
        const hours = parseInt(parts[0], 10) || 0;
        const minutes = parseInt(parts[1], 10) || 0;
        const seconds = parts.length > 2 ? parseInt(parts[2], 10) || 0 : 0;

        return hours * 3600 + minutes * 60 + seconds;
      }

      return 0;
    };

    const timeSpentSeconds = parseTimeSpent(task.timeSpent);
    const estimatedTimeSeconds = task.estimatedTime * 60;
    const progress = (timeSpentSeconds / estimatedTimeSeconds) * 100;

    return progress;
  };

  const progressValue = getTimeProgress();
  const progressColor = progressValue > 100 ? "bg-red-500" : "bg-blue-500"; // Change color if time exceeds

  return (
    <Card className="task-card mb-3 border-2 border-muted shadow-sm dark:bg-[#1D1D1D] dark:border-none dark:text-white">
      <CardHeader className="p-3 pb-0 flex flex-row items-start justify-between space-y-0">
        <div>
          <Badge
            variant="outline"
            className={`${getPriorityColor(task.priority)} dark:border-none`}
          >
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit?.(task)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsTimerDialogOpen(true)}>
              Start Timer
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete?.(task.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-3">
        <h3 className="font-medium text-shuttle-gray mb-1.5">{task.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2 dark:text-gray-300">
          {task.description}
        </p>

        {task.estimatedTime && (
          <div className="mb-3">
            <div className="flex justify-between mb-1 text-xs text-muted-foreground">
              <div className="flex items-center dark:text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                <span>Progress</span>
              </div>
              <span>
                {task.timeSpent} / {task.estimatedTime} min
              </span>
            </div>
            <div className="relative w-full h-1 bg-gray-200 dark:bg-gray-500 rounded-full">
              <div
                className={`absolute h-1 rounded-full ${progressColor}`}
                style={{ width: `${Math.min(progressValue, 100)}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 mt-1">
          {task.tags.map((tag) => (
            <div
              key={tag}
              className="flex items-center text-xs bg-muted rounded-full px-2 py-0.5"
            >
              <Tag className="h-3 w-3 mr-1 text-muted-foreground" />
              <span className="text-muted-foreground">{tag}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex justify-between">
        {task.dueDate && (
          <p className="text-xs text-muted-foreground">
            Due: {formatDistanceToNow(task.dueDate, { addSuffix: true })}
          </p>
        )}
        {task.status !== "completed" && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-7 px-2 text-logan hover:text-logan/80"
            onClick={() =>
              onStatusChange?.(
                task.id,
                task.status === "todo" ? "in_progress" : "completed"
              )
            }
          >
            {task.status === "todo" ? "Start" : "Complete"}
          </Button>
        )}
      </CardFooter>

      <Dialog open={isTimerDialogOpen} onOpenChange={setIsTimerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Task Timer</DialogTitle>
            <DialogDescription>
              Track time spent on "{task.title}"
            </DialogDescription>
          </DialogHeader>
          <TaskTimer task={task} />
          <DialogFooter>
            <Button onClick={() => setIsTimerDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
