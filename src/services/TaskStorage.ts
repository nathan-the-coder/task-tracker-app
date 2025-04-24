import { Task } from "@/types/Task";

export const TaskStorage = { 
  getTasks: (): Task[] => {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks, (key, value) => {
        if (key === 'createdAt' || key === 'updatedAt') {
          return new Date(value);
        }
        return value;
    }): [];
  },

  saveTasks: (tasks: Task[]): void => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  },

  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task => {
    const tasks = TaskStorage.getTasks() ??  [];

    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    tasks.push(newTask);
    TaskStorage.saveTasks(tasks);
    return newTask;
  },

  updateTask: (taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>): Task | null => {

    const tasks = TaskStorage.getTasks() ??  [];
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) return null;

    const updatedTask = {
      ...tasks[taskIndex],
      ...updates,
      updatedAt: new Date()
    };

    tasks[taskIndex] = updatedTask;
    TaskStorage.saveTasks(tasks);
    return updatedTask;
  },

  deleteTask: (taskId: string): boolean => {
    const tasks = TaskStorage.getTasks() ??  [];
    const filteredTasks = tasks.filter(task => task.id !== taskId);

    if (filteredTasks.length === tasks.length) {
      return false;
    }

    TaskStorage.saveTasks(filteredTasks);
    return true;
  },

  toggleTaskCompletion: (taskId: string): Task | null => {
    const tasks = TaskStorage.getTasks();
    const task = tasks.find(t => t.id === taskId);

    if (!task) return null;

    return TaskStorage.updateTask(taskId, { completed: !task.completed });
  }
};
