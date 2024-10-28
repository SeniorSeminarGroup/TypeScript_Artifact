// src/tasks/taskUI.ts

import { saveTasks } from './taskStorage';
import { Task, easyTask, mediumTask, hardTask } from "./Task";

let tasks: Task[] = [];
//let toDo = tasks;

// Add a task to the list UI
export function addListItem(task: Task, list: HTMLUListElement | null): boolean {
    const item = document.createElement("li");

    const unfinishedList = document.querySelector<HTMLUListElement>("#unfinished-tasks-list");
    const finishedList = document.querySelector<HTMLUListElement>("#finished-tasks-list");

    const taskItemHTML = `
        <button type="button" id="up" class="btn btn-secondary">&#8593;</button>
        <button type="button" id="down" class="btn btn-secondary" style="margin-left: 3px; margin-right: 3px;">&#8595;</button>
        <input id="checkbox-completed" class="check-input" type="checkbox">
        <a id="title">${task.title}</a>
        <button type="button" id="remove-button" style="background-color: #e12a2a; float: right; border: 2px solid white;" class="btn btn-danger material-icons">delete_forever</button>
        `;
 
    item.innerHTML = taskItemHTML;
    item.style.backgroundColor = task.color;

    const upButton = item.querySelector("#up") as HTMLButtonElement;
    const downButton = item.querySelector("#down") as HTMLButtonElement;
    const removeButton = item.querySelector("#remove-button") as HTMLButtonElement;
    const title = item.querySelector("#title") as HTMLElement;
    const checkbox = item.querySelector("#checkbox-completed") as HTMLInputElement;

    checkbox.checked = task.completed;

    if (task.completed) {
        item.classList.add("task-completed");
        upButton.disabled = true;
        downButton.disabled = true;
    } else {
        item.classList.remove("task-completed");
        upButton.disabled = false;
        downButton.disabled = false;
    }

    checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked;
        updateOrder()
        saveTasks(tasks);
        renderTasks(tasks, unfinishedList, finishedList)
    });
    
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

function updateOrder(): void {
    let i = -1
    //console.log(tasks)
    tasks.forEach(task => {
        i++
        if (task.completed) {
            tasks.splice(tasks.length,0,task)
            tasks.splice(i,1)
        } 
    })
}

// Render all tasks in the list UI
export function renderTasks(taskList: Task[], unfinishedList: HTMLUListElement | null, 
    finishedList: HTMLUListElement | null): void {
        
    tasks = taskList; // Update the global tasks array
    unfinishedList!.innerHTML = ""; // Clear existing unfinished tasks
    finishedList!.innerHTML = ""; // Clear existing finished tasks
//Add completed tasks to the finished task list and the unfinished tasks to the unfinished task list
    tasks.forEach(task => {
        if (task.completed) {
            addListItem(task, finishedList)
        } else {
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

