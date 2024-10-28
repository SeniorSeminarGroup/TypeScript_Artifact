import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import { Task, easyTask, mediumTask, hardTask } from '../src/tasks/Task';
import { addListItem, renderTasks } from '../src/tasks/taskUI';
import { loadTasks, saveTasks } from '../src/tasks/taskStorage';

describe('Task Management', () => {
  let dom: JSDOM;
  let document: Document;
  let tasks: Task[];

  beforeEach(() => {
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
      <body>
        <form id="new-task-form">
          <input type="text" id="new-task-title" />
          <input type="radio" id="easy" name="difficulty" value="easy" />
          <input type="radio" id="medium" name="difficulty" value="medium" />
          <input type="radio" id="hard" name="difficulty" value="hard" />
        </form>
        <ul id="unfinished-tasks-list"></ul>
        <ul id="finished-tasks-list"></ul>
        <button id="reset-list"></button>
      </body>
      </html>
    `);
    document = dom.window.document;
    global.document = document;

    // Mock localStorage
    (global as any).localStorage = {
      getItem: (key: string) => {
        return (global as any).localStorage[key] || null;
      },
      setItem: (key: string, value: string) => {
        (global as any).localStorage[key] = value;
      },
      removeItem: (key: string) => {
        delete (global as any).localStorage[key];
      },
    };

    tasks = [];
  });

  it('should add a new easy task', () => {
    const unfinishedList = global.document.querySelector<HTMLUListElement>("#unfinished-tasks-list");
    const newTask = new easyTask('1', 'Easy Task', false, new Date());
    tasks.push(newTask);
    addListItem(newTask, unfinishedList);
    expect(unfinishedList?.children.length).to.equal(1);
  });

  it('should add a new medium task', () => {
    const unfinishedList = global.document.querySelector<HTMLUListElement>("#unfinished-tasks-list");
    const newTask = new mediumTask('2', 'Medium Task', false, new Date());
    tasks.push(newTask);
    addListItem(newTask, unfinishedList);
    expect(unfinishedList?.children.length).to.equal(1);
  });

  it('should add a new hard task', () => {
    const unfinishedList = global.document.querySelector<HTMLUListElement>("#unfinished-tasks-list");
    const newTask = new hardTask('3', 'Hard Task', false, new Date());
    tasks.push(newTask);
    addListItem(newTask, unfinishedList);
    expect(unfinishedList?.children.length).to.equal(1);
  });

  it('should render tasks correctly', () => {
    const unfinishedList = global.document.querySelector<HTMLUListElement>("#unfinished-tasks-list");
    const finishedList = global.document.querySelector<HTMLUListElement>("#finished-tasks-list");
    tasks = [
      new easyTask('1', 'Easy Task', false, new Date()),
      new mediumTask('2', 'Medium Task', true, new Date()),
      new hardTask('3', 'Hard Task', false, new Date())
    ];
    renderTasks(tasks, unfinishedList, finishedList);
    expect(unfinishedList?.children.length).to.equal(2);
    expect(finishedList?.children.length).to.equal(1);
  });

  it('should toggle task completion', () => {
    const unfinishedList = global.document.querySelector<HTMLUListElement>("#unfinished-tasks-list");
    const finishedList = global.document.querySelector<HTMLUListElement>("#finished-tasks-list");
    const newTask = new easyTask('1', 'Easy Task', false, new Date());
    tasks.push(newTask);
    addListItem(newTask, unfinishedList);
    const checkbox = unfinishedList?.querySelector<HTMLInputElement>("#checkbox-completed");
    checkbox!.checked = true;
    checkbox!.dispatchEvent(new dom.window.Event('change'));
    expect(newTask.completed).to.be.true;
    renderTasks(tasks, unfinishedList, finishedList);
    expect(unfinishedList?.children.length).to.equal(0);
    expect(finishedList?.children.length).to.equal(1);
  });

  it('should delete all tasks', () => {
    const unfinishedList = global.document.querySelector<HTMLUListElement>("#unfinished-tasks-list");
    const finishedList = global.document.querySelector<HTMLUListElement>("#finished-tasks-list");
    tasks = [
      new easyTask('1', 'Easy Task', false, new Date()),
      new mediumTask('2', 'Medium Task', true, new Date()),
      new hardTask('3', 'Hard Task', false, new Date())
    ];
    renderTasks(tasks, unfinishedList, finishedList);
    tasks = [];
    renderTasks(tasks, unfinishedList, finishedList);
    expect(unfinishedList?.children.length).to.equal(0);
    expect(finishedList?.children.length).to.equal(0);
  });

  it('should save and load tasks correctly', () => {
    const newTask = new easyTask('1', 'Easy Task', false, new Date());
    tasks.push(newTask);
    saveTasks(tasks);
    const loadedTasks = loadTasks();
    expect(loadedTasks.length).to.equal(1);
    expect(loadedTasks[0].title).to.equal('Easy Task');
  });
});