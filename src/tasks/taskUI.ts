// src/tasks/taskUI.ts

import { saveTasks } from './taskStorage';
import { Task } from "./Task";

let tasks: Task[] = [];
//let toDo = tasks;

// Add a task to the list UI
export function addListItem(task: Task, list: HTMLUListElement | null): boolean {
    const item = document.createElement("li");
    const checkbox = document.createElement("input");

    const unfinishedList = document.querySelector<HTMLUListElement>("#unfinished-tasks-list");
    const finishedList = document.querySelector<HTMLUListElement>("#finished-tasks-list");

    checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked;
        saveTasks(tasks);
        renderTasks(tasks, unfinishedList, finishedList)
        renderTasks(tasks, unfinishedList, finishedList)
    });

    const taskItemHTML = `
        <button type="button" id="up" class="btn btn-secondary">&#8593;</button>
        <button type="button" id="down" class="btn btn-secondary" style="margin-left: 3px; margin-right: 3px;">&#8595;</button>
        <a id="title">${task.title}</a>
        <button type="button" id="remove-button" style="float: right;" class="btn btn-danger material-icons">delete_forever</button>
        `;

    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
 
    item.innerHTML = taskItemHTML;

    const upButton = item.querySelector("#up") as HTMLButtonElement;
    const downButton = item.querySelector("#down") as HTMLButtonElement;
    const removeButton = item.querySelector("#remove-button") as HTMLButtonElement;
    const title = item.querySelector("#title") as HTMLElement;

    title.prepend(checkbox, " ");

    if (task.completed) {
        item.classList.add("task-completed");
        upButton.disabled = true;
        downButton.disabled = true;
    } else {
        item.classList.remove("task-completed");
        upButton.disabled = false;
        downButton.disabled = false;
    }
    //Addded delete buttons for individual tasks'
    removeButton.addEventListener("click", () => {
        for(let i=0; i<tasks.length; i++){
            if(tasks.at(i)?.id == task.id){
                tasks.splice(i,1)
            }
        }
        renderTasks(tasks, unfinishedList, finishedList)
    });

    upButton.addEventListener("click", () => {
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


    downButton.addEventListener("click", () => {
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

