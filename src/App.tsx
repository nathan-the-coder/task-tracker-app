// src/App.tsx
import React, { useState, useEffect } from 'react';
import { Task } from './types/Task';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { TaskStorage } from './services/TaskStorage';
import { Button } from './components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Plus } from 'lucide-react'; 
import { DialogDescription } from '@radix-ui/react-dialog';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    // Load tasks from local storage on initial render
    setTasks(TaskStorage.getTasks());
  }, []);
  
  const handleAddTask = (newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    TaskStorage.addTask(newTask);
    setTasks(TaskStorage.getTasks());

    // Close dialog after adding tasks
    setIsDialogOpen(false);
  };
  
  const handleToggleComplete = (taskId: string) => {
    TaskStorage.toggleTaskCompletion(taskId);
    setTasks(TaskStorage.getTasks());
  };
  
  const handleEditTask = (taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    TaskStorage.updateTask(taskId, updates);
    setTasks(TaskStorage.getTasks());
  };
  
  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      TaskStorage.deleteTask(taskId);
      setTasks(TaskStorage.getTasks());
    }
  };
  
  return (
    <div className="max-w-lg mx-auto mt-8 p-4">
      
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Task Tracker</h1>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus className="w-4 h-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>
                Form for adding new tasks
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <TaskForm
                onSubmit={handleAddTask}
                onCancel={() =>  setIsDialogOpen(false)}
                 />
            </div>
          </DialogContent>
        </Dialog>
      </header>
      
      <div>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold mb-2">Your Tasks</h2>
          <span className="text-sm text-gray-500">
            {tasks.length} {tasks.length ===   1 ? 'task' : 'tasks'}
          </span>
        </div>

        <TaskList
          tasks={tasks}
          onToggleComplete={handleToggleComplete}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
      </div>
    </div>
  );
}

export default App;
