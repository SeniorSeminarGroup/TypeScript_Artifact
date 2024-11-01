import { Task } from "./Task";

// Load tasks from local storage
export function loadTasks(): Task[] {
    const taskJSON = localStorage.getItem("TASKS");
    if (taskJSON == null) return [];
    
    return JSON.parse(taskJSON);
}

// Save tasks to local storage
export function saveTasks(tasks: Task[]): void {
    localStorage.setItem("TASKS", JSON.stringify(tasks));
}