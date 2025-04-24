import React, { useState } from 'react';
import { Task } from '../types/Task';
import { TaskForm } from './TaskForm';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Edit } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onEditTask: (taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  onDeleteTask: (taskId: string) => void;
}

export function TaskItem({ task, onToggleComplete, onEditTask, onDeleteTask }: TaskItemProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditSubmit = (updatedTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    onEditTask(task.id, updatedTask);
    setIsEditDialogOpen(false);
  };

  return (
    <>
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
            onClick={() => setIsEditDialogOpen(true)}
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

      {/* MODAL placed outside the card to ensure it floats properly */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Update the task details below</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <TaskForm
              onSubmit={handleEditSubmit}
              initialTask={task}
              buttonText="Save Changes"
              onCancel={() => setIsEditDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

