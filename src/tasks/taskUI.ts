// src/tasks/taskUI.ts

import { saveTasks } from './taskStorage';
import { Task } from "./Task";

let tasks: Task[] = [];

// Add a task to the list UI
export function addListItem(task: Task, list: HTMLUListElement | null): boolean {
    const item = document.createElement("li");
    const label = document.createElement("label");
    const checkbox = document.createElement("input");

    checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked;
        saveTasks(tasks);
        renderTasks(tasks, document.getElementById("unfinished-tasks-list") as HTMLUListElement, document.getElementById("finished-tasks-list") as HTMLUListElement);
    });

    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    label.append(checkbox, task.title);
    item.append(label);

    if (task.completed) {
        item.classList.add("task-completed");
    } else {
        item.classList.remove("task-completed");
    }

    list?.append(item);

    return true;
}

// Render all tasks in the list UI
export function renderTasks(taskList: Task[], unfinishedList: HTMLUListElement | null, finishedList: HTMLUListElement | null): void {
    tasks = taskList; // Update the global tasks array
    unfinishedList!.innerHTML = ""; // Clear existing unfinished tasks
    finishedList!.innerHTML = ""; // Clear existing finished tasks

    tasks.forEach(task => {
        if (task.completed) {
            addListItem(task, finishedList);
        } else {
            addListItem(task, unfinishedList);
        }
    });
}