// src/tasks/taskUI.ts

import { saveTasks } from './taskStorage';
import { Task } from "./Task";

let tasks: Task[] = [];

// Add a task to the list UI
export function addListItem(task: Task, list: HTMLUListElement | null): boolean {
    const item = document.createElement("li");
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    const remove = document.createElement("button");
    const up = document.createElement("button");
    const downe = document.createElement("button");

    const unfinishedList = document.querySelector<HTMLUListElement>("#unfinished-tasks-list");
    const finishedList = document.querySelector<HTMLUListElement>("#finished-tasks-list");

    checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked;
        saveTasks(tasks);
        renderTasks(tasks, document.getElementById("unfinished-tasks-list") as HTMLUListElement, document.getElementById("finished-tasks-list") as HTMLUListElement);
    });

    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    remove.type = "button";
    remove.textContent = "delete";
    remove.id = "remove-button";
    up.type = 
    label.append(checkbox, task.title, remove);
    item.append(label);

    if (task.completed) {
        item.classList.add("task-completed");
    } else {
        item.classList.remove("task-completed");
    }
//Addded delete buttons for individual tasks
    remove.addEventListener("click", () => {
        task.removed = true
        let length = tasks.length
        for(let i=0; i<length; i++){
            if(tasks.at(i)?.removed){
                tasks.splice(i,1)
            }
        }
        renderTasks(tasks, unfinishedList, finishedList)
    });

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