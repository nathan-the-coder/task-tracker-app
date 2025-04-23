// src/components/TaskList.tsx
import React, { useState } from 'react';
import { Task } from '../types/Task';
import { TaskItem } from './TaskItem';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onEditTask: (taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  onDeleteTask: (taskId: string) => void;
}

export function TaskList({ tasks, onToggleComplete, onEditTask, onDeleteTask }: TaskListProps) {
  // Use state for the active tab
  const [activeTab, setActiveTab] = useState("all");
  
  // Filter tasks based on the active tab
  const getFilteredTasks = () => {
    if (activeTab === 'active') return tasks.filter(task => !task.completed);
    if (activeTab === 'completed') return tasks.filter(task => task.completed);
    return tasks; // "all" tab
  };
  
  const filteredTasks = getFilteredTasks();
  
  return (
    <div>
      <Tabs defaultValue="all" onValueChange={setActiveTab} className="mb-4">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {renderTaskList(filteredTasks)}
        </TabsContent>
        
        <TabsContent value="active">
          {renderTaskList(filteredTasks)}
        </TabsContent>
        
        <TabsContent value="completed">
          {renderTaskList(filteredTasks)}
        </TabsContent>
      </Tabs>
    </div>
  );
  
  function renderTaskList(tasks: Task[]) {
    if (tasks.length === 0) {
      return <p className="text-gray-500 italic">No tasks to display.</p>;
    }
    
    return tasks.map(task => (
      <TaskItem
        key={task.id}
        task={task}
        onToggleComplete={onToggleComplete}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
      />
    ));
  }
}
