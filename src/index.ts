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

// Declare variables at a higher scope
let newTimer: Timer | undefined;
let clock: HTMLSpanElement | null;

// #####################    TASK LIST    #####################
/* task logic */
if (typeof document !== 'undefined') {
  const unfinishedList = document.querySelector<HTMLUListElement>("#unfinished-tasks-list");
  const finishedList = document.querySelector<HTMLUListElement>("#finished-tasks-list");
  const form = document.querySelector<HTMLFormElement>("#new-task-form");
  const input = document.querySelector<HTMLInputElement>("#new-task-title");
  const reset = document.querySelector<HTMLButtonElement>("#reset-list")
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
                console.log("got here: " + taskDifficulty)
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

  //Deletes all the tasks in the task list
  reset?.addEventListener('click', () => {
    let length = tasks.length
    for(let i=0; i<length; i++){
      tasks.splice(0,1)
    }
    renderTasks(tasks, unfinishedList, finishedList);
  });

  // #####################    TIMER    #####################
  //new timer (created on page refresh)
  clock = document.querySelector<HTMLSpanElement>('#clock-time')
  const canvas = document.querySelector<HTMLCanvasElement>('#timerCanvas')
  const newWorkTime: TimeInterval = returnWorkInterval(document);
  const newBreakTime: TimeInterval = { hours: 0, minutes: 1, seconds: 0 };
  newTimer = new Timer(newWorkTime, newBreakTime, clock!, setColor, canvas!);
  const leftContainerElement = document.querySelector<HTMLSpanElement>('.right');
  function setColor(color: string) {
    leftContainerElement!.style.backgroundColor = color
  }
  setTimeLength(document)

  /* timer button logic and event listener */
  const startStop = document.querySelector<HTMLButtonElement>("#start-stop-button")
  startStop?.addEventListener("click", f => {
    if (newTimer!.paused) {
      newTimer!.stop()
      startStop.innerHTML = "play_circle"
    } else {
      newTimer!.start()
      startStop.innerHTML = "pause"
    }

  })

  const resetButton = document.querySelector<HTMLButtonElement>("#reset-button");
  resetButton?.addEventListener("click", () => {
    newTimer!.stop();
    startStop!.innerHTML = "play_circle";
    newTimer!.reset();
  });

  // #####################    TIME SET    #####################
  const timeSet = document.querySelector<HTMLButtonElement>("#set-break");
  timeSet?.addEventListener('click', () => {
    setTimeLength(document);
  });
}

/**
 * Changes the workTimeLength and breakTimeLength variables to the values inputed by the user
 */
export function setTimeLength(document: Document) {
  const break_time_minutes = Number(document.querySelector<HTMLInputElement>("#break-length")?.value);

  let break_hours: number = 0;
  let break_minutes: number = 0;
  let break_seconds: number = 5;

  if (break_time_minutes > 0) {
    break_hours = Math.floor(break_time_minutes / 60);
    break_minutes = Math.floor(break_time_minutes % 60);
    break_seconds = Math.floor((break_time_minutes * 60) % 60);
  }

  // Set the global variables
  const workTimeLength = returnWorkInterval(document);
  const breakTimeLength = { hours: break_hours, minutes: break_minutes, seconds: break_seconds };

  if (newTimer) {
    newTimer.setWorkInterval(workTimeLength);
    newTimer.setBreakInterval(breakTimeLength);
  }

  if (clock) {
    clock.innerHTML = formatTime(workTimeLength);
  }

  return { workTimeLength, breakTimeLength };
}

export function returnWorkInterval(document: Document): TimeInterval {
  const work_time_minutes = Number(document.querySelector<HTMLInputElement>("#work-length")?.value);

  let work_hours: number = 0;
  let work_minutes: number = 0;
  let work_seconds: number = 10;
  if (work_time_minutes > 0) {
    work_hours = Math.floor(work_time_minutes / 60);
    work_minutes = Math.floor(work_time_minutes % 60);
    work_seconds = Math.floor((work_time_minutes * 60) % 60);
  }

  const workTimeLength = { hours: work_hours, minutes: work_minutes, seconds: work_seconds };
  console.log("return work interval: workTimeLength = " + work_seconds);
  return workTimeLength;
}