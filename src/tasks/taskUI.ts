// src/tasks/taskUI.ts

import { saveTasks } from './taskStorage';
import { Task } from "./Task";

let tasks: Task[] = [];
//let toDo = tasks;

// Add a task to the list UI
export function addListItem(task: Task, list: HTMLUListElement | null): boolean {
    const item = document.createElement("li");
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    const remove = document.createElement("button");
    const up = document.createElement("button");
    const down = document.createElement("button");

    const unfinishedList = document.querySelector<HTMLUListElement>("#unfinished-tasks-list");
    const finishedList = document.querySelector<HTMLUListElement>("#finished-tasks-list");

    checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked;
        saveTasks(tasks);
        renderTasks(tasks, unfinishedList, finishedList)
        renderTasks(tasks, unfinishedList, finishedList)
    });

    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    remove.type = "button";
    remove.textContent = "delete";
    remove.id = "remove-button";
    up.type = "button";
    up.innerHTML = "&#8593";
    up.id = "up"
    down.innerHTML = "&#8595";
    down.type = "button";
    down.id = "down";
    label.append(up, down, checkbox, task.title, remove);
    item.append(label);

    if (task.completed) {
        item.classList.add("task-completed");
    } else {
        item.classList.remove("task-completed");
    }
//Addded delete buttons for individual tasks
    remove.addEventListener("click", () => {
        for(let i=0; i<tasks.length; i++){
            if(tasks.at(i)?.id == task.id){
                tasks.splice(i,1)
            }
        }
        renderTasks(tasks, unfinishedList, finishedList)
    });

    up.addEventListener("click", () => {
        let i = 0
        let look = true
        while(i<tasks.length && look){
            if(tasks.at(i)?.id == task.id){
                if(i == 0){

                }else{
                let theTask: Task = tasks.splice(i,1)[0]
                console.log(theTask)
                tasks.splice(i-1,0, theTask)
                look = false
                }
                
            }
            i++
        }
        renderTasks(tasks, unfinishedList, finishedList)
    });


    down.addEventListener("click", () => {
        let i = 0
        let look = true
        while(i<getNumUnfinishedTasks()-1 && look && !task.completed){
            if(tasks.at(i)?.id == task.id){
                if(i == tasks.length){

                }else{
                let theTask: Task = tasks.splice(i,1)[0]
               // console.log(theTask)
                tasks.splice(i+1,0, theTask)
                look = false
                }
                
            }
            i++
        }
        renderTasks(tasks, unfinishedList, finishedList)
    });

    list?.append(item);

    return true;
}

// Render all tasks in the list UI
export function renderTasks(taskList: Task[], unfinishedList: HTMLUListElement | null, finishedList: HTMLUListElement | null): void {
    tasks = taskList; // Update the global tasks array
    //toDo = []
    unfinishedList!.innerHTML = ""; // Clear existing unfinished tasks
    finishedList!.innerHTML = ""; // Clear existing finished tasks

    let i = -1
    tasks.forEach(task => {
        i++
        console.log(task)
        if (task.completed) {
            tasks.splice(tasks.length,0,task)
            tasks.splice(i,1)
            addListItem(task, finishedList)
        } else {
           // toDo[toDo.length] = task;
            addListItem(task, unfinishedList);
        }
    })
    saveTasks(tasks);
}

function getNumUnfinishedTasks(): number {
    let count: number = 0
    tasks.forEach(task => {
        if (!task.completed) {
           count++
        } 
    })
    return count
}

