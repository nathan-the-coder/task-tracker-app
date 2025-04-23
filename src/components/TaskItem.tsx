// src/components/TaskItem.tsx
import React, { useState } from 'react';
import { Task } from '../types/Task';
import { TaskForm } from './TaskForm';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onEditTask: (taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  onDeleteTask: (taskId: string) => void;
}

export function TaskItem({ task, onToggleComplete, onEditTask, onDeleteTask }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleEditSubmit = (updatedTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    onEditTask(task.id, updatedTask);
    setIsEditing(false);
  };
  
  if (isEditing) {
    return (
      <Card className="mb-4">
        <CardContent className="pt-6">
          <TaskForm 
            onSubmit={handleEditSubmit} 
            initialTask={task} 
            buttonText="Save Changes"
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            variant="outline"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className={`mb-4 ${task.completed ? 'bg-gray-50' : ''}`}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start flex-1 gap-3">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => onToggleComplete(task.id)}
              className="mt-1"
            />
            <div>
              <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`mt-1 text-sm ${task.completed ? 'text-gray-500' : 'text-gray-700'}`}>
                  {task.description}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Created: {task.createdAt.toLocaleString()}
                {task.updatedAt > task.createdAt && 
                  ` | Updated: ${task.updatedAt.toLocaleString()}`}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button 
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </Button>
        <Button 
          variant="destructive"
          size="sm"
          onClick={() => onDeleteTask(task.id)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
