// src/components/TaskForm.tsx
import { Task } from '../types/Task';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialTask?: Task;
  buttonText?: string;
  onCancel: () =>  void;
}

export function TaskForm({ onSubmit, initialTask, buttonText = 'Add Task', onCancel }: TaskFormProps) {
  // Define the form schema
  const formSchema = z.object({
    title: z.string().min(1, { message: "Task title is required" }),
    description: z.string().optional(),
  });

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialTask?.title || "",
      description: initialTask?.description || "",
    },
  });

  // Handle form submission
  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit({
      title: values.title.trim(),
      description: values.description?.trim() || undefined,
      completed: initialTask?.completed || false,
    });
    
    if (!initialTask) {
      form.reset();
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2 space-y-0 items-start">
              <FormLabel className="flex shrink-0">Task Title</FormLabel>
              <div className="w-full">
                <FormControl>
                  <Input
                    placeholder="Enter task title"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2 space-y-0 items-start">
              <FormLabel className="flex shrink-0">Description (optional)</FormLabel>
              <div className="w-full">
                <FormControl>
                  <Textarea
                    placeholder="Enter task description"
                    className="resize-y"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          { onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            {buttonText}
          </Button>
        </div>
      </form>
    </Form>
  );
}
