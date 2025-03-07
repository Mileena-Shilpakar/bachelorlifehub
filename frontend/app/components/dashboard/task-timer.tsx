"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import type { Task } from "@/app/types";
import { toast } from "react-toastify";

interface TaskTimerProps {
  task: Task;
}

export function TaskTimer({ task }: TaskTimerProps) {
  const [sessionTime, setSessionTime] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const parseTimeSpent = (timeStr: string | number): number => {
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

  const [elapsedTime, setElapsedTime] = useState(
    parseTimeSpent(task.timeSpent || "00:00:00")
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        setSessionTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive]);

  const toggleTimer = async () => {
    setIsActive(!isActive);

    if (isActive) {
      await axios.post(
        `http://localhost:8000/api/task/save-timer-session/${task.id}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("task-token")}`,
          },
        }
      );
    } else {
      await axios.post(
        `http://localhost:8000/api/task/${task.id}/start-timer-session/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("task-token")}`,
          },
        }
      );
    }
  };

  const resetTimer = async () => {
    try {
      await axios.delete(
        `http://localhost:8000/api/task/cancel-timer-session/${task.id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("task-token")}`,
          },
        }
      );

      setSessionTime(0);
      setIsActive(false);
      toast.success("Timer has been reset");
    } catch (err) {
      console.log(err);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      seconds.toString().padStart(2, "0"),
    ].join(":");
  };

  const totalTimeSeconds = elapsedTime + sessionTime;

  const estimatedTimeSeconds = task.estimatedTime ? task.estimatedTime * 60 : 0;

  const progressPercentage = estimatedTimeSeconds
    ? Math.min(100, (totalTimeSeconds / estimatedTimeSeconds) * 100)
    : 0;

  return (
    <Card className="border-none bg-muted/50">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-40 h-40 mb-4">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="5"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="5"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * progressPercentage) / 100}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-3xl font-bold text-shuttle-gray">
                {formatTime(sessionTime)}
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground mb-4">
            <p>Current session: {formatTime(sessionTime)}</p>
            <p>Total time spent: {task.timeSpent || "00:00:00"}</p>
            {task.estimatedTime && (
              <p>
                Estimated: {task.estimatedTime} min (
                {isNaN(progressPercentage) ? 0 : Math.round(progressPercentage)}
                %)
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={toggleTimer}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isActive ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {isActive ? "Pause" : "Start"}
            </Button>
            <Button
              onClick={resetTimer}
              variant="outline"
              className="flex items-center gap-2"
              disabled={!sessionTime}
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
