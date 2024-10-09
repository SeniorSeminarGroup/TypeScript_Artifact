/* 
10/1/24
Roland Locke

Original Document created following the "How to build Your First TypeScript Project" guide.
by: Web Dev Simplified
Link: https://www.youtube.com/watch?v=jBmrduvKl5w 


*/
import { v4 as uuidV4 } from "uuid"
import { Timer } from "./Timer"
import { TimeInterval } from "./TimeInterval"
import { formatTime } from "./TimeInterval"

/* Task type to specify a task */
type Task = {
  id: string,
  title: string,
  completed: boolean,
  createdAt: Date,
}

/* place to store the Interval timer if paused */
let globalIntervalId: number = -1
/* place to save the time if user pauses the timer */
let saveTime: TimeInterval = {hours: 0, minutes: 0, seconds: 0}
/* track if user is currently in work or break mode */
let workTime:boolean = true

/**holds the current work and break interval lengths */
// let workTimeLength: TimeInterval = {hours: 0, minutes: 25, seconds: 0}
// let breakTimeLength: TimeInterval = {hours: 0, minutes: 5, seconds: 0}

/* task logic */
const list = document.querySelector<HTMLUListElement>("#list")
const form = document.querySelector("#new-task-form") as HTMLFormElement | null
const input = document.querySelector<HTMLInputElement>("#new-task-title")

//new timer (created on page refresh)
const clock = document.querySelector<HTMLSpanElement>('#clock-time')
const newWorkTime: TimeInterval = { hours: 0, minutes: 0, seconds: 10 };
const newBreakTime: TimeInterval = { hours: 0, minutes: 0, seconds: 5 };
const newTimer = new Timer(newWorkTime, newBreakTime, clock!);

/* timer button logic and event listener */
const startStop = document.querySelector<HTMLButtonElement>("#start-stop-button")
startStop?.addEventListener("click", f => {
  if(newTimer.paused) {
    newTimer.stop()
    startStop.innerHTML = "Start"
  } else {
    newTimer.start()
    startStop.innerHTML = "Pause"
  }
  
})

const tasks: Task[] = loadTasks()
tasks.forEach(addListItem)

form?.addEventListener("submit", e => {
  e.preventDefault()

  if (input?.value == "" || input?.value == null) return

  const newTask: Task = {
    id: uuidV4(),
    title: input.value,
    completed: false,
    createdAt: new Date()
  }
  tasks.push(newTask)

  addListItem(newTask)
  input.value = ""
})

const timeSet = document.querySelector<HTMLButtonElement>("#set-break")
//timeSet?.addEventListener("click", e =>setTimeLength)
timeSet?.addEventListener('click', () => {
  setTimeLength()
});

function addListItem(task: Task): boolean {
  const item = document.createElement("li")
  const label = document.createElement("label")
  const checkbox = document.createElement("input")
  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked
    saveTasks()
  })
  checkbox.type = "checkbox"
  checkbox.checked = task.completed
  label.append(checkbox, task.title)
  item.append(label)
  list?.append(item)

  return true
}

function saveTasks() {
  localStorage.setItem("TASKS", JSON.stringify(tasks))
}

function loadTasks(): Task[] {
  const taskJSON = localStorage.getItem("TASKS")
  if(taskJSON == null) return []

  return JSON.parse(taskJSON)
}

/**
 * Changes the workTimeLength and breakTimeLength variables to the values inputed by the user
 */
function setTimeLength() {
  //number of minutes that the intervals should be set for
  const work_time_minutes = Number(document.querySelector<HTMLInputElement>("#work-length")?.value)
  const break_time_minutes = Number(document.querySelector<HTMLInputElement>("#break-length")?.value)

  //default values
  if (work_time_minutes==null || work_time_minutes==0){
    const work_hours: number = 0
    const work_minutes: number = 25
    const work_seconds: number = 0
  }
  if (break_time_minutes==null || break_time_minutes==0){
    const break_hours: number = 0
    const break_minutes: number = 5
    const break_seconds: number = 0
  }

  //Calculate the hours, minutes, and seconds based off of the total minutes
  const work_hours: number = Math.floor(work_time_minutes / 60)
  const work_minutes: number = Math.floor(work_time_minutes % 60)
  const work_seconds: number = Math.floor((work_time_minutes*60) % 60)

  const break_hours: number = Math.floor(break_time_minutes / 60)
  const break_minutes: number = Math.floor(break_time_minutes % 60)
  const break_seconds: number = Math.floor((break_time_minutes*60) % 60)
  
  //set the global variables
  const workTimeLength = {hours: work_hours, minutes: work_minutes, seconds: work_seconds}
  const breakTimeLength = {hours: break_hours, minutes: break_minutes, seconds: break_seconds}
  newTimer.setWorkInterval(workTimeLength)
  newTimer.setBreakInterval(breakTimeLength)
  clock!.innerHTML = formatTime(workTimeLength)
}