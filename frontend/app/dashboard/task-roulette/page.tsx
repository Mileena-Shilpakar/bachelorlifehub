"use client"

import { useState, useEffect } from "react"
import { Wheel } from "react-custom-roulette"
import { Search } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import type { Task, Status } from "@/app/types"

interface WheelSegment {
  option: string;
  style: {
    backgroundColor: string;
    textColor: string;
  };
  task?: Task;
}

const DEFAULT_SEGMENT: WheelSegment = { 
  option: 'No tasks selected', 
  style: { backgroundColor: '#cccccc', textColor: 'black' } 
};

export default function TaskRoulette() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [availableTasks, setAvailableTasks] = useState<Task[]>([])
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set())
  const [segments, setSegments] = useState<WheelSegment[]>([DEFAULT_SEGMENT])
  const [searchQuery, setSearchQuery] = useState("")
  const [mustSpin, setMustSpin] = useState(false)
  const [prizeNumber, setPrizeNumber] = useState<number>(0)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isResultOpen, setIsResultOpen] = useState(false)

  useEffect(() => {
    const fetchTasks = async() => {
      try {
        const response = await axios.get('http://localhost:8000/api/task/tasks', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('task-token')}`
          }
        });
        
        const transformedTasks = response.data.map((task: any) => ({
          id: task.id.toString(),
          title: task.title,
          description: task.description || "",
          dueDate: task.due_date ? new Date(task.due_date) : null,
          status: task.status as Status,
          priority: task.priority,
          estimatedTime: task.estimated_time,
          timeSpent: task.time_spent,
          tags: task.tags?.map((tag: {name: string}) => tag.name) || [],
          createdAt: new Date(task.created_at),
          updatedAt: new Date(task.updated_at)
        }));
        
        setTasks(transformedTasks);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        toast.error("Failed to fetch tasks");
      }
    };
    
    fetchTasks();
  }, []);

  useEffect(() => {
    // Filter out completed tasks
    const incompleteTasks = tasks.filter(task => task.status !== 'completed');
    setAvailableTasks(incompleteTasks);
  }, [tasks]);

  useEffect(() => {
    if (selectedTaskIds.size === 0) {
      setSegments([DEFAULT_SEGMENT]);
      return;
    }

    const selectedTasks = availableTasks.filter(task => selectedTaskIds.has(task.id));

    const colorPalette = [
      { backgroundColor: '#7C83FD', textColor: 'white' },
      { backgroundColor: '#96BAFF', textColor: 'black' },
      { backgroundColor: '#7579E7', textColor: 'white' },
      { backgroundColor: '#9AB3F5', textColor: 'black' },
      { backgroundColor: '#646FD4', textColor: 'white' },
      { backgroundColor: '#8B9AD9', textColor: 'black' },
    ];

    const newSegments = selectedTasks.map((task, index) => ({
      option: task.title || "Untitled Task",
      style: colorPalette[index % colorPalette.length],
      task: task
    }));

    setSegments(newSegments);
  }, [selectedTaskIds, availableTasks]);

  const handleTaskToggle = (taskId: string) => {
    const newSelectedTaskIds = new Set(selectedTaskIds);
    
    if (selectedTaskIds.has(taskId)) {
      newSelectedTaskIds.delete(taskId);
    } else {
      newSelectedTaskIds.add(taskId);
    }
    
    setSelectedTaskIds(newSelectedTaskIds);
  };

  const spinWheel = () => {
    if (mustSpin || segments.length === 0 || segments[0].option === 'No tasks selected') return;
    
    const randomIndex = Math.floor(Math.random() * segments.length);
    setPrizeNumber(randomIndex);
    setMustSpin(true);
  };

  const handleSpinEnd = () => {
    if (segments[prizeNumber]?.task) {
      setSelectedTask(segments[prizeNumber].task);
      setIsResultOpen(true);
    }
    setMustSpin(false);
  };

  const filteredTasks = availableTasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (task.tags && task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-shuttle-gray">Task Roulette</h2>
        
      </div>

      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-shuttle-gray">
            Can't decide which task to tackle first?
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <p className="text-center text-muted-foreground">
            {selectedTaskIds.size === 0 
              ? "Select tasks below to add them to the wheel" 
              : `Spin the wheel to randomly select from ${selectedTaskIds.size} selected tasks!`}
          </p>

          <div className="wheel-container w-full max-w-md mx-auto">
            {segments.length > 0 && (
              <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                data={segments}
                outerBorderWidth={2}
                outerBorderColor="#ddd"
                innerBorderColor="#ddd"
                innerBorderWidth={8}
                radiusLineColor="#ddd"
                radiusLineWidth={2}
                perpendicularText
                textDistance={60}
                onStopSpinning={handleSpinEnd}
              />
            )}
          </div>

          <Button 
            onClick={spinWheel} 
            disabled={mustSpin || selectedTaskIds.size === 0}
            className="bg-black hover:bg-black/90 text-white"
            size="lg"
          >
            {mustSpin ? 'Spinning...' : 'Spin the Wheel'}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-shuttle-gray">Select Tasks for the Wheel</CardTitle>
          <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tasks..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        </CardHeader>
        <CardContent>
          {availableTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No incomplete tasks found</div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No matching tasks found</div>
          ) : (
            <div className="grid gap-3">
              {filteredTasks.map(task => (
                <div 
                  key={task.id} 
                  className="p-3 bg-black/10 rounded-md border border-logan/20 flex justify-between items-center"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Checkbox 
                      id={`task-${task.id}`}
                      checked={selectedTaskIds.has(task.id)}
                      onCheckedChange={() => handleTaskToggle(task.id)}
                    />
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {task.description ? 
                          (task.description.length > 50 ? 
                            `${task.description.substring(0, 50)}...` : 
                            task.description) : 
                          "No description"}
                      </p>
                      {task.tags && task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {task.tags.map(tag => (
                            <span key={tag} className="bg-black/20 text-logan px-1.5 py-0.5 rounded-full text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="badge bg-black/20 text-logan text-xs px-2 py-1 rounded">
                    {task.priority}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isResultOpen} onOpenChange={setIsResultOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              🎯 Here's your task!
            </DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="py-4 space-y-4">
              <div className="bg-black/10 p-4 rounded-lg border border-logan/30">
                <h3 className="text-xl font-bold text-logan mb-2">{selectedTask.title}</h3>
                <p className="text-sm text-gray-700 mb-3">{selectedTask.description || "No description"}</p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedTask.tags && selectedTask.tags.map(tag => (
                    <span key={tag} className="bg-black/20 text-logan px-2 py-1 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>
                    <span className="font-medium">Priority:</span> {selectedTask.priority}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span> {selectedTask.status.replace('_', ' ')}
                  </div>
                  <div>
                    <span className="font-medium">Est. Time:</span> {selectedTask.estimatedTime || 'N/A'}
                  </div>
                  {selectedTask.dueDate && (
                    <div>
                      <span className="font-medium">Due:</span> {new Date(selectedTask.dueDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  onClick={() => setIsResultOpen(false)}
                  className="bg-black text-white"
                >
                  Start Working
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}