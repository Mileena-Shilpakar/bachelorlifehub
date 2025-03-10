"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { CalendarIcon, TagIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import type { Priority, Status, Task } from "@/app/types";

interface TaskFormProps {
  task: Task | null;
  onSave: (task: Task) => void;
}

export function TaskForm({ task, onSave }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState<Status>(task?.status || "todo");
  const [priority, setPriority] = useState<Priority>(
    task?.priority || "medium"
  );
  const [dueDate, setDueDate] = useState<Date | null>(task?.dueDate || null);
  const [estimatedTime, setEstimatedTime] = useState<number>(
    task?.estimatedTime || 30
  );
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(task?.tags || []);

  const handleSave = () => {
    if (!title || !description) {
      alert("Title and description are required.");
      return;
    }

    const updatedTask: Task = {
      id: task?.id || uuidv4(),
      title,
      description,
      status,
      priority,
      dueDate,
      estimatedTime,
      timeSpent: task?.timeSpent || 0,
      tags,
      createdAt: task?.createdAt || new Date(),
      updatedAt: new Date(),
      userId: task?.userId || "user-1",
    };

    onSave(updatedTask);
  };

  const handleUpdate = async () => {
    if (!title || !description) {
      alert("Title and description are required.");
      return;
    }

    const updatedTask: Task = {
      id: task!.id,
      title,
      description,
      status,
      priority,
      dueDate,
      estimatedTime,
      timeSpent: task?.timeSpent || 0,
      tags,
      createdAt: task?.createdAt || new Date(),
      updatedAt: new Date(),
      userId: task?.userId || "user-1",
    };

    onSave(updatedTask);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-3 py-2 px-2 sm:px-4 w-full max-w-4xl mx-auto dark:bg-[#1F1F1F]">
      <div className="space-y-2">
        <Label htmlFor="title">Task title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          className="w-full dark:bg-[#444444]"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
          className="min-h-[60px] dark:bg-[#444444]"
        />
      </div>

      <div className="space-y-2">
        <Label>Priority</Label>
        <RadioGroup
          value={priority}
          onValueChange={(value) => setPriority(value as Priority)}
          className="flex flex-wrap"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="low" id="low" />
            <Label htmlFor="low" className="cursor-pointer">
              Low
            </Label>
          </div>
          <div className="flex items-center space-x-2 mx-4">
            <RadioGroupItem value="medium" id="medium" />
            <Label htmlFor="medium" className="cursor-pointer">
              Medium
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="high" id="high" />
            <Label htmlFor="high" className="cursor-pointer">
              High
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
            className="w-full dark:bg-[#444444] flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="estimatedTime">Estimated time (minutes)</Label>
          <Input
            id="estimatedTime"
            type="number"
            min="1"
            className="dark:bg-[#444444]"
            value={estimatedTime}
            onChange={(e) =>
              setEstimatedTime(Number.parseInt(e.target.value) || 0)
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Due date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal dark:bg-[#444444]"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, "PPP") : "Select a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dueDate || undefined}
              initialFocus
              onSelect={(day) => {
                if (day) {
                  // Strip time by setting hours, minutes, seconds, and milliseconds to zero
                  const localDate = new Date(day);
                  localDate.setHours(0, 0, 0, 0); // Reset time to midnight to avoid time zone issues
                  setDueDate(localDate);
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label>Milestones Tags</Label>
        <div className="flex">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Add a tag"
            className="flex-1 dark:bg-[#444444]"
          />
          <Button
            type="button"
            onClick={addTag}
            variant="outline"
            className="ml-2 dark:bg-[#BB86FC] dark:text-white"
          >
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="flex items-center gap-1"
            >
              <TagIcon className="h-3 w-3" />
              {tag}
              <Button
                variant="destructive"
                size="icon"
                className="h-4 w-4"
                onClick={() => removeTag(tag)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {tag}</span>
              </Button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          onClick={task ? handleUpdate : handleSave}
          disabled={!title}
          variant="default"
          className="dark:bg-[#BB86FC] dark:text-white"
        >
          {task ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </div>
  );
}
