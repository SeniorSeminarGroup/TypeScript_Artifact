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
import { loadTasks, saveTasks } from './tasks/taskStorage';
import { Task } from "./tasks/Task";
import { easyTask } from "./tasks/Task";
import { mediumTask } from "./tasks/Task";
import { hardTask } from "./tasks/Task";
import { addListItem, renderTasks } from './tasks/taskUI';

// #####################    TASK LIST    #####################
/* task logic */
const unfinishedList = document.querySelector<HTMLUListElement>("#unfinished-tasks-list");
const finishedList = document.querySelector<HTMLUListElement>("#finished-tasks-list");
const form = document.querySelector<HTMLFormElement>("#new-task-form");
const input = document.querySelector<HTMLInputElement>("#new-task-title");
const tasks: Task[] = loadTasks();
renderTasks(tasks, unfinishedList, finishedList);

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  if (input?.value == "" || input?.value == null) return;

  let taskDifficulty: string = "";

  const difficulties = document.querySelectorAll<HTMLInputElement>('[name="difficulty"]');
  
  difficulties.forEach((difficultyOption) => {
      if (difficultyOption.checked) {
          // Get the label associated with the checked radio button
          const label = document.querySelector(`label[for="${difficultyOption.id}"]`);
          if (label) {
              taskDifficulty = label.innerHTML.trim();  // Assign the inner HTML of the label
              console.log("got here")
          }
      }
  });

  let newTask : Task;

  if (taskDifficulty == "Easy"){
    newTask = new easyTask(uuidV4(), input.value, false, new Date())
  }
  else if (taskDifficulty == "Medium"){
    newTask = new mediumTask(uuidV4(), input.value, false, new Date())
  }
  else {
    newTask = new hardTask(uuidV4(), input.value, false, new Date())
  }

  tasks.push(newTask);

  addListItem(newTask, unfinishedList);
  saveTasks(tasks);
  input.value = "";
});

// #####################    TIMER    #####################
//new timer (created on page refresh)
const clock = document.querySelector<HTMLSpanElement>('#clock-time')
const newWorkTime: TimeInterval = returnWorkInterval();
const newBreakTime: TimeInterval = { hours: 0, minutes: 1, seconds: 0 };
const newTimer = new Timer(newWorkTime, newBreakTime, clock!, setColor);
function setColor(color: string) {
  document.body.style.backgroundColor = color
}
setTimeLength()

/* timer button logic and event listener */
const startStop = document.querySelector<HTMLButtonElement>("#start-stop-button")
startStop?.addEventListener("click", f => {
  if (newTimer.paused) {
    newTimer.stop()
    startStop.innerHTML = "Start"
  } else {
    newTimer.start()
    startStop.innerHTML = "Pause"
  }

})

// #####################    TIME SET    #####################
const timeSet = document.querySelector<HTMLButtonElement>("#set-break")
timeSet?.addEventListener('click', () => {
  setTimeLength()
});

/**
 * Changes the workTimeLength and breakTimeLength variables to the values inputed by the user
 */
function setTimeLength() {
  const break_time_minutes = Number(document.querySelector<HTMLInputElement>("#break-length")?.value)

  let break_hours: number = 0
  let break_minutes: number = 0
  let break_seconds: number = 5

  if (break_time_minutes > 0) {
    break_hours = Math.floor(break_time_minutes / 60)
    break_minutes = Math.floor(break_time_minutes % 60)
    break_seconds = Math.floor((break_time_minutes * 60) % 60)
  }

  //set the global variables
  const workTimeLength = returnWorkInterval()
  const breakTimeLength = { hours: break_hours, minutes: break_minutes, seconds: break_seconds }
  newTimer.setWorkInterval(workTimeLength)
  newTimer.setBreakInterval(breakTimeLength)
  clock!.innerHTML = formatTime(workTimeLength)
}

function returnWorkInterval(): TimeInterval {

  const work_time_minutes = Number(document.querySelector<HTMLInputElement>("#work-length")?.value)


  let work_hours: number = 0
  let work_minutes: number = 0
  let work_seconds: number = 10
  if (work_time_minutes > 0) {//Calculate the hours, minutes, and seconds based off of the total minutes
    work_hours = Math.floor(work_time_minutes / 60)
    work_minutes = Math.floor(work_time_minutes % 60)
    work_seconds = Math.floor((work_time_minutes * 60) % 60)
  }

  const workTimeLength = { hours: work_hours, minutes: work_minutes, seconds: work_seconds }
  console.log("return work interval: workTimeLength = " + work_seconds)
  return workTimeLength
}
// #####################    Splitview    #####################

// #####################    Graph Generation?    #####################

