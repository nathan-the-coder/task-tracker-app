// src/App.tsx
import React, { useState, useEffect } from 'react';
import { Task } from './types/Task';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { TaskStorage } from './services/TaskStorage';
import { Button } from './components/ui/button';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  
  useEffect(() => {
    // Load tasks from local storage on initial render
    setTasks(TaskStorage.getTasks());
  }, []);
  
  const handleAddTask = (newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    TaskStorage.addTask(newTask);
    setTasks(TaskStorage.getTasks());
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
      <h1 className="text-2xl font-bold mb-6">Task Tracker</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add New Task</h2>
        <TaskForm onSubmit={handleAddTask} />
      </div>
      
      <div>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold mb-2">Your Tasks</h2>
          <Button type="submit" className="w-32">
            New Task
          </Button>
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
